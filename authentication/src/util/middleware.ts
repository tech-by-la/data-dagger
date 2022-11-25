import {NextFunction, Request, Response} from "express";
import {Cookies, HttpErrMsg, RequestKeys, StatusCode} from "./enums.js";
import {partitionEmails, respondError} from "./helpers.js";
import {OrgRequestBody, UserRequestBody} from "./interfaces.js";
import Jwt from "../security/jwt.js";
import {JwtPayload} from "jsonwebtoken";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const cookie = req.header('cookie') || "";
    const cookies = cookie.split(" ");
    let jwt = "";
    for (let cookie of cookies) {
        if (cookie.startsWith(Cookies.JWT)) {
            const token = cookie.split('=')[1];
            jwt = token.replace(';', '');
        }
    }

    const decoded = await Jwt.verifyJwt(jwt);
    if (!decoded) {
        respondError(res, StatusCode.UNAUTHORIZED, HttpErrMsg.UNAUTHORIZED);
        return;
    }

    const { sub, email, roles, orgs } = decoded as unknown as JwtPayload;
    if (!sub || !email || !roles || !orgs) {
        respondError(res, StatusCode.UNAUTHORIZED, HttpErrMsg.UNAUTHORIZED);
        return;
    }

    req.user = { id: sub, email, roles, orgs }
    next();
}

export const verifyUserRequestBody = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as UserRequestBody;

    if (!email || !password) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.MISSING_CREDENTIALS);
        return;
    }
    next();
}

export const verifyOrgRequestBody = (req: Request, res: Response, next: NextFunction) => {

    let { name } = req.body as OrgRequestBody;

    if (!name) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.MISSING_ORG_INFO);
        return;
    }

    next();
}

export const verifyInviteRequestBody = (req: Request, res: Response, next: NextFunction) => {

    const illegalArguments = getIllegalArguments(
        Object.keys(req.body), RequestKeys.org_id, RequestKeys.emails
    );

    if (illegalArguments.length > 0) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.ILLEGAL_ARGUMENT + illegalArguments);
        return;
    }

    let { org_id, emails } = req.body;

    if (!org_id || !emails) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.MISSING_INV_INFO);
        return;
    }

    if (typeof org_id !== "string" || !(emails instanceof Array)) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.INVALID_TYPE);
        return;
    }

    if ((new Set(emails).size !== emails.length)) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.DUPLICATE_ENTRIES);
        return;
    }

    next();
}

export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body as UserRequestBody;

    const {valid} = partitionEmails([email]);
    if (email !== valid[0]) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.INVALID_EMAIL);
        return;
    }
    next();
}

export const filterAuthCookies = (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies) {
        req.cookies = {}
    }

    const cookie = req.header('cookie');
    if (!cookie) {
        next();
        return;
    }

    const cookies = cookie.split(" ");
    for (let cookie of cookies) {
        if (cookie.startsWith(Cookies.JWT)) {
            const token = cookie.split('=')[1];
            if (!token) continue;
            req.cookies[Cookies.JWT] = token.replace(';', '');

        } else if (cookie.startsWith(Cookies.REFRESH_TOKEN)) {
            const token = cookie.split('=')[1];
            if (!token) continue;
            req.cookies[Cookies.REFRESH_TOKEN] = token.replace(';', '');
        }
    }

    next();
}


// Internal helpers

const getIllegalArguments = (requestBodyKeys: string[], ...legalArgs: string[]) => {
    let illegalArgs = [];
    for (const key of requestBodyKeys) {
        if (!legalArgs.includes(key)) {
            illegalArgs.push(key);
        }
    }
    return illegalArgs;
}



