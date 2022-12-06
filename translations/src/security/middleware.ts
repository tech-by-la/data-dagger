import {Request, Response, NextFunction} from "express";
import {StatusCode} from "../utils/enums.js";
import Jwt from "./jwt.js";

export const authorizeSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {

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
