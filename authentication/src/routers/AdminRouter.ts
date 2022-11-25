import {Router} from 'express';
import {authenticate, authorizeAdmin} from "../util/middleware.js";
import {respondError} from "../util/helpers.js";
import {HttpErrMsg, StatusCode} from "../util/enums.js";
import db from '../database/DatabaseGateway.js';

const router = Router();

router.put('/user-enabled', authenticate, authorizeAdmin, async (req, res) => {
    const { user_id, enabled } = req.query;

    if ((enabled !== 'true' && enabled !== 'false') || !user_id || typeof user_id !== "string") {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.INVALID_QUERY);
        return;
    }

    const user = await db.userRepo.findUserById(user_id);
    if (!user) {
        respondError(res, StatusCode.NOT_FOUND, HttpErrMsg.RESOURCE_NOT_FOUND);
        return;
    }

    // An admin cannot disable themselves
    if (req.user.id === user_id) {
        respondError(res, StatusCode.FORBIDDEN, HttpErrMsg.PERMISSION_DENIED);
        return;
    }

    user.enabled = enabled === 'true';
    const success = await db.userRepo.updateUser(user).catch();
    if (!success) {
        respondError(res, StatusCode.INTERNAL_SERVER_ERROR, HttpErrMsg.INTERNAL_ERROR);
        return;
    }

    res.status(StatusCode.NO_CONTENT).send();
});

export default router;
