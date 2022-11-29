import {Router} from 'express';
import bcrypt from "bcrypt";

import {filterAuthCookies, validateEmail, verifyUserRequestBody} from "../util/middleware.js";
import {expireCookies, login, respondError, validateRefreshToken} from "../util/helpers.js";
import {Cookies, HttpErrMsg, StatusCode} from "../util/enums.js";
import {UserRequestBody} from "../util/interfaces.js";
import db from "../database/DatabaseGateway.js";
import Jwt from "../security/jwt.js";

const router = Router();

router.post('/login', verifyUserRequestBody, async (req, res) => {
    const { email, password } = req.body as UserRequestBody;

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

    const refreshToken = await Jwt.signNewRefreshTokenFamily(user.id);
    await login(res, user, refreshToken);
});

router.post('/register', verifyUserRequestBody, validateEmail, async (req, res) => {
    const { email, password, first_name, last_name } = req.body as UserRequestBody;

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

    const user = await db.userRepo.createUser(email, password, first_name, last_name);

    // Error occurred when creating the user in the database
    if (!user) {
        respondError(res, StatusCode.INTERNAL_SERVER_ERROR, HttpErrMsg.INTERNAL_ERROR);
        return;
    }

    const refreshToken = await Jwt.signNewRefreshTokenFamily(user.id);
    res.status(StatusCode.CREATED);
    await login(res, user, refreshToken);
});

router.post('/renew', filterAuthCookies, async (req, res) => {

    // If JWT is valid, no need to renew.
    const jwt = req.cookies[Cookies.JWT];
    if (await Jwt.verifyJwt(jwt)) {
        res.send();
        return;
    }

    const refreshToken = req.cookies[Cookies.REFRESH_TOKEN];

    const validation = await validateRefreshToken(refreshToken);

    if (!validation) {
        expireCookies(res, Cookies.REFRESH_TOKEN);
        respondError(res, StatusCode.UNAUTHORIZED, HttpErrMsg.INVALID_REFRESH_TOKEN);
        return;
    }

    const { user, newToken } = validation;
    await login(res, user, newToken);
});

router.post('/logout', filterAuthCookies, async (req, res) => {

    const refreshToken = req.cookies[Cookies.REFRESH_TOKEN];

    if (refreshToken) {
        await db.refreshTokenRepo.findRefreshTokenByToken(refreshToken)
            .then(token => {
                if (token) {
                    db.refreshTokenRepo.deleteRefreshTokensByUserAndFamily(token.user_id, token.family);
                }
            });
    }

    expireCookies(res, Cookies.JWT, Cookies.REFRESH_TOKEN);
    res.status(StatusCode.NO_CONTENT).send();
});

export default router;
