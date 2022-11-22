import {NextFunction, Request, Response} from "express";
import {HttpErrMsg, StatusCode} from "./enums.js";
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

    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const isValid = pattern.test(String(email).toLowerCase());
    if (!isValid) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.INVALID_EMAIL);
        return;
    }
    next();
}
