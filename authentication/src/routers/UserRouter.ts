import {Router} from 'express';
import db from '../database/DatabaseGateway.js';
import {respondError} from "../util/helpers.js";
import {HttpErrMsg, StatusCode} from "../util/enums.js";
import {UserInfo} from "../util/interfaces";

const router = Router();

router.get('/', async (req, res) => {
    const query = req.query.ids?.toString();

    let users: UserInfo[] | null = [];
    if (!query) {
        users = await db.userRepo.getAll();
    } else {
        const ids = query.split(',').map(id => id.trim());
        users = await db.userRepo.findManyUsersById(ids);
    }

    if (!users || users.length === 0) {
        respondError(res, StatusCode.NOT_FOUND, HttpErrMsg.RESOURCE_NOT_FOUND);
    } else {
        res.send({users});
    }
});
export default router;
