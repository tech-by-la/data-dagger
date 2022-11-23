import {Response} from "express";
import {Cookies, HttpErrMsg, StatusCode} from "./enums.js";
import {UserWithRoles} from "./interfaces.js";
import Jwt from "../security/jwt.js";
import db from '../database/DatabaseGateway.js';
import {RefreshToken} from "@prisma/client";

export const respondError = (res: Response, code: StatusCode, message: string) => {
    const error = StatusCode[code].replace("_", " ");
    res.status(code).send({
        code,
        error,
        message,
    });
}

export const login = async (res: Response, user: UserWithRoles | null, refreshToken: RefreshToken | null) => {
    const jwt = await Jwt.getLoginJwt(user);

    if (!jwt || !refreshToken) {
        respondError(res, StatusCode.ERROR, HttpErrMsg.INTERNAL_ERROR);
        return false;
    }

    res.cookie(Cookies.JWT, jwt, {
        maxAge: 1000 * 60 * 15, // 15 minutes
        httpOnly: true,
        sameSite: 'strict',
        secure: false, // TODO: use secure cookie
    });

    res.cookie(Cookies.REFRESH_TOKEN, refreshToken.token, {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        sameSite: 'strict',
        secure: false, // TODO: use secure cookie
    });

    res.send();
}

/**
 * Verifies token validity, then invalidates token and renews it
 * @param token
 * @returns newToken
 */
export const validateRefreshToken = async (token: string) => {
    const verified = await Jwt.verifyRefreshToken(token);
    if (!verified) return;

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

    return await Jwt.renewRefreshToken(refreshToken.user_id, refreshToken);
}

export const expireCookies = (res: Response, ...cookies: string[]) => {
    for (const cookie of cookies) {
        res.cookie(cookie, '', {
            expires: new Date(0)
        });
    }
};
