import {NextFunction, Request, Response} from "express";
import {Cookies, HttpErrMsg, RequestKeys, StatusCode, UserRoles} from "./enums.js";
import {partitionEmails, respondError} from "./helpers.js";
import {AuthUser, OrgRequestBody, UserRequestBody} from "./interfaces.js";
import Jwt from "../security/jwt.js";
import {JwtPayload} from "jsonwebtoken";


/**
 * Authenticates a user by verifying a JWT token. Attaches the user object to the request object.
 * Access by calling req.user
 * @param req
 * @param res
 * @param next
 */
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

    req.user = { id: sub, email, roles, orgs } as AuthUser;
    next();
}

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user.roles.includes(UserRoles.ADMIN) && !req.user.roles.includes(UserRoles.SUPER_ADMIN)) {
        respondError(res, StatusCode.UNAUTHORIZED, HttpErrMsg.UNAUTHORIZED);
        return;
    }
    next();
}

export const authorizeSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user.roles.includes(UserRoles.SUPER_ADMIN)) {
        respondError(res, StatusCode.UNAUTHORIZED, HttpErrMsg.UNAUTHORIZED);
        return;
    }
    next();
}

// ===== Request body validation ===== //

export const verifyUserRequestBody = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as UserRequestBody;

    if (!email || !password) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.MISSING_REQUIRED_FIELDS + `: ${RequestKeys.email} or ${RequestKeys.password}`);
        return;
    }
    next();
}

export const verifyOrgRequestBody = (req: Request, res: Response, next: NextFunction) => {

    let { name } = req.body as OrgRequestBody;

    if (!name) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.MISSING_REQUIRED_FIELDS + `: ${RequestKeys.name}`);
        return;
    }

    next();
}

export const verifyInviteRequestBody = (req: Request, res: Response, next: NextFunction) => {

    if (respondErrorIfIllegalArguments(res, Object.keys(req.body),
        RequestKeys.org_id, RequestKeys.emails
    )) {
        return;
    }

    let { org_id, emails } = req.body;

    if (!org_id || !emails) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.MISSING_REQUIRED_FIELDS + `: ${RequestKeys.org_id} or ${RequestKeys.emails}`);
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

export const verifyInviteAnswerRequestBody = (req: Request, res: Response, next: NextFunction) => {

    if (respondErrorIfIllegalArguments(res, Object.keys(req.body),
        RequestKeys.org_id, RequestKeys.answer
    )) {
        return;
    }

    const { org_id, answer } = req.body;

    if (!org_id || !answer) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.MISSING_REQUIRED_FIELDS + `: ${RequestKeys.org_id} or ${RequestKeys.answer}`);
        return;
    }

    if (typeof org_id !== "string" || typeof answer !== "boolean") {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.INVALID_TYPE);
        return;
    }

    next();
}

export const verifyInviteDeleteRequestBody = (req: Request, res: Response, next: NextFunction) => {

    if (respondErrorIfIllegalArguments(res, Object.keys(req.body),
        RequestKeys.org_id, RequestKeys.email
    )) {
        return;
    }

    const { org_id, email } = req.body;

    if (!org_id || !email) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.MISSING_REQUIRED_FIELDS);
        return;
    }

    if (
        typeof org_id !== "string" ||
        typeof email !== "string"
    ) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.INVALID_TYPE);
        return;
    }

    next();
}

export const verifyAssignRolesRequestBody = (req: Request, res: Response, next: NextFunction) => {

    if (respondErrorIfIllegalArguments(res, Object.keys(req.body),
        RequestKeys.user_id, RequestKeys.role, RequestKeys.remove
    )) {
        return;
    }

    const { user_id, role, remove } = req.body;

    if (!user_id || !role || !remove) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.MISSING_REQUIRED_FIELDS);
        return;
    }

    if (
        typeof user_id !== "string" ||
        typeof role !== "string" ||
        typeof remove !== "string"
    ) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.INVALID_TYPE);
        return;
    }

    // cannot remove USER role. set enabled to false instead
    if (remove && role === UserRoles.USER) {
        respondError(res, StatusCode.FORBIDDEN, HttpErrMsg.PERMISSION_DENIED);
        return;
    }

    next();
}

// ===== Other ===== //

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


// === Internal helpers === //

// takes a request body and a list of legal keys and sends an error response if any illegal keys are found
const respondErrorIfIllegalArguments = (res: Response, requestBodyKeys: string[], ...legalArgs: string[]) => {
    const illegalArguments = [];
    for (const key of requestBodyKeys) {
        if (!legalArgs.includes(key)) {
            illegalArguments.push(key);
        }
    }

    if (illegalArguments.length > 0) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.ILLEGAL_ARGUMENT + illegalArguments);
        return false;
    }

    return true;
}



