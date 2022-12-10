import {Router} from 'express';
import bcrypt from "bcrypt";

import {filterAuthCookies, validateEmail, verifyUserRequestBody} from "../util/middleware.js";
import {expireCookies, login, respondError, validateRefreshToken} from "../util/helpers.js";
import {Cookies, HttpErrMsg, StatusCode} from "../util/enums.js";
import {UserRequestBody} from "../util/interfaces.js";
import db from "../database/DatabaseGateway.js";
import Jwt from "../security/jwt.js";
import Logger from "../util/Logger.js";

const router = Router();

router.post('/login', verifyUserRequestBody, async (req, res) => {
    const { email, password } = req.body as UserRequestBody;

    const user = await db.userRepo.findUserByEmail(email);
    const isCorrectPassword = user && await bcrypt.compare(password, user.password_hash)

    // Email or password is incorrect
    if (!user || !isCorrectPassword) {
        Logger.log("AuthRouter:", "Email or password incorrect on login -", email);
        respondError(res, StatusCode.UNAUTHORIZED, HttpErrMsg.BAD_CREDENTIALS);
        return;
    }

    // User is banned/disabled
    if (!user.enabled) {
        Logger.log("AuthRouter:", "User account disabled on login -", user.email);
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
        Logger.log("AuthRouter:", "Failed - Attempted to created account with password short than 6 characters");
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.PASSWORD_TOO_SHORT);
        return;
    }

    // Email already in use
    if (await db.userRepo.findUserByEmail(email)) {
        Logger.log("AuthRouter:", "Failed - Attempted to created account with email already in use");
        respondError(res, StatusCode.CONFLICT, HttpErrMsg.EMAIL_IN_USE);
        return;
    }

    const user = await db.userRepo.createUser(email, password, first_name, last_name);

    // Error occurred when creating the user in the database
    if (!user) {
        Logger.error("AuthRouter:", "Error - Failed to create user when querying database");
        respondError(res, StatusCode.INTERNAL_SERVER_ERROR, HttpErrMsg.INTERNAL_ERROR);
        return;
    }

    Logger.log("AuthRouter:", "Create new user with id", user.id);

    const refreshToken = await Jwt.signNewRefreshTokenFamily(user.id);
    res.status(StatusCode.CREATED);
    await login(res, user, refreshToken);
});

router.post('/renew', filterAuthCookies, async (req, res) => {

    // If JWT is valid, no need to renew.
    const jwt = req.cookies[Cookies.ID_TOKEN];
    if (await Jwt.verifyJwt(jwt)) {
        res.send();
        return;
    }

    const refreshToken = req.cookies[Cookies.REFRESH_TOKEN];

    const validation = await validateRefreshToken(refreshToken);

    if (!validation) {
        Logger.log("AuthRouter:", "Failed - Could not validate refresh token");
        expireCookies(res, Cookies.REFRESH_TOKEN);
        respondError(res, StatusCode.UNAUTHORIZED, HttpErrMsg.INVALID_REFRESH_TOKEN);
        return;
    }

    const { user, newToken } = validation;
    await login(res, user, newToken);
});

router.post('/logout', filterAuthCookies, async (req, res) => {

    let refreshToken = req.cookies[Cookies.REFRESH_TOKEN];

    if (refreshToken) {
        await db.refreshTokenRepo.findRefreshTokenByToken(refreshToken)
            .then(token => {
                if (token) {
                    db.refreshTokenRepo.deleteRefreshTokensByUserAndFamily(token.user_id, token.family);
                    return token;
                }
            });
    }

    expireCookies(res, Cookies.ID_TOKEN, Cookies.REFRESH_TOKEN);
    res.status(StatusCode.NO_CONTENT).send();
});

export default router;
