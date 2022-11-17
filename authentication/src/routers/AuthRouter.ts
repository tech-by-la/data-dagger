import {Response, Router} from 'express';
import bcrypt from "bcrypt";

import {HttpErrMsg, StatusCode} from "../util/enums.js";
import {UserLogin} from "../util/interfaces.js";
import db from "../database/DatabaseGateway.js";
import Jwt from "../security/jwt.js";

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body as UserLogin;

    if (!email || !password) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.MISSING_CREDENTIALS);
        return;
    }

    const user = await db.userRepo.findUserByEmail(email);
    const isCorrectPassword = user && await bcrypt.compare(password, user.password_hash)
    // Email or password is incorrect
    if (!user || !isCorrectPassword) {
        respondError(res, StatusCode.UNAUTHORIZED, HttpErrMsg.BAD_CREDENTIALS);
        return;
    }

    // User is banned/disabled
    if (!user.enabled) {
        respondError(res, StatusCode.UNAUTHORIZED, HttpErrMsg.USER_DISABLED);
    }

    const jwt = await Jwt.signJwt(user);
    const refreshToken = "";
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
    res.send();
});

router.post('/register', (req, res) => {

});

export default router;

// === Helper Functions === //
const respondError = (res: Response, code: StatusCode, message: string) => {
    const error = StatusCode[code].replace("_", " ");
    res.status(code).send({
        code,
        error,
        message,
    })
}
