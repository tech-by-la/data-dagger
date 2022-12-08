import {Router} from 'express';
import Jwt from "../security/jwt.js";
import {respondError} from "../util/helpers.js";
import {HttpErrMsg, StatusCode} from "../util/enums.js";
import Logger from "../util/Logger.js";

const router = Router();

/*
 * fetch public RSA key used to verify idToken
 */
router.get('/publickey', (req, res) => {

    const key = Jwt.getPublicJwtKey();

    if (!(key + "")) {
        Logger.warn("KeyRouter:", "PublicKey is empty");
        respondError(res, StatusCode.NOT_FOUND, HttpErrMsg.RESOURCE_NOT_FOUND);
        return;
    }

    res.send(key);
});

export default router;
