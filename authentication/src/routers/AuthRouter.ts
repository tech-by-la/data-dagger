import {Router} from 'express';
import bcrypt from "bcrypt";

import {validateEmail, verifyUserRequestBody} from "../util/middleware.js";
import {attachLoginCookies, respondError} from "../util/helpers.js";
import {HttpErrMsg, StatusCode} from "../util/enums.js";
import {UserLogin} from "../util/interfaces.js";
import db from "../database/DatabaseGateway.js";

const router = Router();

router.post('/login', verifyUserRequestBody, async (req, res) => {
    const { email, password } = req.body as UserLogin;

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
        return;
    }

    // Cookie was signed successfully
    const success = await attachLoginCookies(res, user);
    if (!success) return;

    res.send();
});

router.post('/register', verifyUserRequestBody, validateEmail, async (req, res) => {
    const { email, password } = req.body as UserLogin;

    // Password too short
    if (password.length < 6) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.PASSWORD_TOO_SHORT);
        return;
    }

    // Email already in use
    if (await db.userRepo.findUserByEmail(email)) {
        respondError(res, StatusCode.CONFLICT, HttpErrMsg.EMAIL_IN_USE);
        return;
    }

    const user = await db.userRepo.createUser(email, password);

    // Error occurred when creating the user in the database
    if (!user) {
        respondError(res, StatusCode.ERROR, HttpErrMsg.INTERNAL_ERROR);
        return;
    }

    // Cookie was signed successfully
    const success = await attachLoginCookies(res, user);
    if (!success) return;

    res.send();
});

export default router;
