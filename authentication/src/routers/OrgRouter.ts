import {Router} from 'express';
import {authenticate, verifyOrgRequestBody} from "../util/middleware.js";
import {OrgRequestBody} from "../util/interfaces.js";
import db from '../database/DatabaseGateway.js'
import {respondError} from "../util/helpers.js";
import {HttpErrMsg, StatusCode} from "../util/enums.js";

const router = Router();

router.post('/', authenticate, verifyOrgRequestBody, async (req, res) => {
    let { name, contact_email, contact_phone } = req.body as OrgRequestBody;

    if (!contact_email) {
        contact_email = req.user.email;
    }

    if (await db.orgRepo.findOrgByName(name)) {
        respondError(res, StatusCode.CONFLICT, HttpErrMsg.ORG_NAME_IN_USE);
        return;
    }

    const org = await db.orgRepo.createOrg(req.user.id, name, contact_email, contact_phone);

    if (!org) {
        respondError(res, StatusCode.INTERNAL_SERVER_ERROR, HttpErrMsg.INTERNAL_ERROR);
        return;
    }

    res.status(StatusCode.CREATED).send();
});

export default router;
