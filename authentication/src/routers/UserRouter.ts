import {Router} from 'express';
import db from '../database/DatabaseGateway.js';
import {respondError} from "../util/helpers.js";
import {HttpErrMsg, StatusCode} from "../util/enums.js";
import {UserInfo} from "../util/interfaces.js";
import {authorizeAdmin} from "../util/middleware.js";
import Logger from "../util/Logger.js";

const router = Router();

/*
 * fetch ALL users
 */
router.get('/', authorizeAdmin, async (req, res) => {
    const query = req.query.ids?.toString();

    let users: UserInfo[] | null = [];
    if (!query) {
        users = await db.userRepo.getAll();
    } else {
        const ids = query.split(',').map(id => id.trim());
        users = await db.userRepo.findManyUsersById(ids);
    }

    if (!users || users.length === 0) {
        Logger.error("UserRouter:", "Error - no users found when querying database");
        respondError(res, StatusCode.NOT_FOUND, HttpErrMsg.RESOURCE_NOT_FOUND);
    } else {
        res.send({users});
    }
});

/*
 * fetch self
 */
router.get('/self', async (req, res) => {
    const user = await db.userRepo.findUserById(req.user.id);
    res.send({ data: user });
});

export default router;
