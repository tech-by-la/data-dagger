import {Response} from "express";
import {HttpErrMsg, StatusCode} from "./enums.js";
import {UserWithRoles} from "./interfaces.js";
import Jwt from "../security/jwt.js";

export const respondError = (res: Response, code: StatusCode, message: string) => {
    const error = StatusCode[code].replace("_", " ");
    res.status(code).send({
        code,
        error,
        message,
    });
}

export const attachLoginCookies = async (res: Response, user: UserWithRoles): Promise<boolean> => {
    const jwt = await Jwt.signJwt(user);
    const refreshToken = "";
    if (!jwt) {
        respondError(res, StatusCode.ERROR, HttpErrMsg.INTERNAL_ERROR);
        return false;
    }

    res.cookie("jwt", jwt, {
        maxAge: 1000 * 60 * 15, // 15 minutes
        httpOnly: true,
        secure: false, // TODO: use secure cookie
    });
    res.cookie("refresh_token", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        secure: false, // TODO: use secure cookie
    });

    return true;
}

