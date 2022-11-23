import {NextFunction, Request, Response} from "express";
import {Cookies, HttpErrMsg, StatusCode} from "./enums.js";
import {respondError} from "./helpers.js";
import {UserLogin} from "./interfaces";

export const verifyUserRequestBody = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as UserLogin;

    if (!email || !password) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.MISSING_CREDENTIALS);
        return;
    }
    next();
}

export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body as UserLogin;

    // email pattern
    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const isValid = pattern.test(String(email).toLowerCase());
    if (!isValid) {
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
