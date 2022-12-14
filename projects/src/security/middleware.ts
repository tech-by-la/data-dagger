import {Request, Response, NextFunction} from "express";
import {JwtPayload} from "jsonwebtoken";
import {StatusCode} from "../utils/enums.js";
import {AuthUser} from "../utils/interfaces.js";
import Jwt from "./jwt.js";

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
        if (cookie.startsWith('idToken')) {
            const token = cookie.split('=')[1];
            jwt = token.replace(';', '');
        }
    }

    const decoded = await Jwt.verifyJwt(jwt);
    if (!decoded) {
        res.status(StatusCode.UNAUTHORIZED).send();
        return;
    }

    const { sub, email, roles, orgs } = decoded as unknown as JwtPayload;
    if (!sub || !email || !roles || !orgs) {
        res.status(StatusCode.UNAUTHORIZED).send();
        return;
    }

    req.user = { id: sub, email, roles, orgs } as AuthUser;
    next();
}

export const authorizeSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {

    if (process.env.ENVIRONMENT === "development") {
        next();
        return;
    }

    const cookie = req.header('cookie') || "";
    const cookies = cookie.split(" ");
    let idToken = "";
    for (let cookie of cookies) {
        if (cookie.startsWith('idToken')) {
            const token = cookie.split('=')[1];
            idToken = token.replace(';', '');
        }
    }

    const decoded = await Jwt.verifyJwt(idToken);
    if (
        !decoded || !decoded.roles ||
        decoded !instanceof Array<string> ||
        !decoded.roles.includes('SUPER_ADMIN')
    ) {
        res.status(StatusCode.UNAUTHORIZED).send();
        return;
    }

    next();
}
