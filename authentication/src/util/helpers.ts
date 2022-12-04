import {Response} from "express";
import {Cookies, HttpErrMsg, StatusCode} from "./enums.js";
import {AuthUser, UserInfo} from "./interfaces.js";
import Jwt from "../security/jwt.js";
import db from '../database/DatabaseGateway.js';
import {RefreshToken} from "@prisma/client";

export const respondError = (res: Response, code: StatusCode, message: string) => {
    const error = StatusCode[code].replaceAll("_", " ");
    res.status(code).send({
        code,
        error,
        message,
    });
}

export const login = async (res: Response, user: UserInfo | null, refreshToken: string | null) => {
    const jwt = await Jwt.signLoginJwt(user);

    if (!jwt || !refreshToken || !user) {
        respondError(res, StatusCode.INTERNAL_SERVER_ERROR, HttpErrMsg.INTERNAL_ERROR);
        return false;
    }

    res.cookie(Cookies.ID_TOKEN, jwt, {
        maxAge: 1000 * 60 * 15, // 15 minutes
        httpOnly: true,
        sameSite: 'strict',
        secure: false, // TODO: use secure cookie
    });

    res.cookie(Cookies.REFRESH_TOKEN, refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        sameSite: 'strict',
        secure: false, // TODO: use secure cookie
    });

    res.send({
        id: user.id,
        email: user.email,
        idToken: jwt,
        expiresIn: 900, // seconds
        refreshToken: refreshToken,
    });
}

/**
 * Verifies token validity, then invalidates token and renews it
 * @returns { user, newToken }
 * @param jwt
 */
export const validateRefreshToken = async (jwt: string) => {
    const verified = await Jwt.verifyRefreshToken(jwt);
    if (!verified) return;

    const { token } = verified;
    const refreshToken = await db.refreshTokenRepo.findRefreshTokenByToken(token);
    if (!refreshToken) return;

    // If user doesn't exist, delete all related
    const user = await db.userRepo.findUserById(refreshToken.user_id);
    if (!user || !user.enabled) {
        db.refreshTokenRepo.deleteRefreshTokensByUser(refreshToken.user_id);
        return;
    }

    // If token is expired or someone used an invalid token, delete token family
    if (!refreshToken.valid || refreshToken.expires < Date.now()) {
        db.refreshTokenRepo.deleteRefreshTokensByUserAndFamily(refreshToken.user_id, refreshToken.family);
        return;
    }

    const newToken = await Jwt.renewRefreshToken(refreshToken.user_id, refreshToken);
    return { user, newToken }
}

export const expireCookies = (res: Response, ...cookies: string[]) => {
    for (const cookie of cookies) {
        res.cookie(cookie, '', {
            expires: new Date(0)
        });
    }
}

export const partitionEmails = (emails: string[]) => {
    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let valid: string[], invalid: string[] = [];
    valid = emails.filter(email => {
        if (pattern.test(String(email).toLowerCase())) return true;
        else invalid.push(email);
    });

    return {valid, invalid}
}

export const authorizeOrgModerator = async (res: Response, user: AuthUser, org_id: string) => {
    const org = await db.orgRepo.findOrgById(org_id);
    const orgRole = user.orgs.find(o => o.org_id === org?.id)?.role;

    // Must be OWNER or MODERATOR to send invites
    if ((orgRole !== "OWNER" && orgRole !== "MODERATOR")) {
        respondError(res, StatusCode.FORBIDDEN, HttpErrMsg.PERMISSION_DENIED);
        return;
    }

    return true;
}
