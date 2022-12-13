import {Router} from 'express';
import {verifyOrgRequestBody} from "../util/middleware.js";
import {OrgRequestBody} from "../util/interfaces.js";
import db from '../database/DatabaseGateway.js'
import {respondError} from "../util/helpers.js";
import {HttpErrMsg, StatusCode} from "../util/enums.js";
import Logger from "../util/Logger.js";

const router = Router();

/*
 * fetch logged-in user's organizations
 */
router.get('/', async (req, res) => {
    Logger.log('OrgRouter:', "Fetching logged-in user's organization");

    const orgs = await db.orgRepo.findManyOrgsByUser_id(req.user.id);
    res.send(orgs);
});

/*
 * fetch organization data by ID
 */
router.get('/:org_id', async (req, res) => {
    Logger.log('OrgRouter:', "Fetching organization with id", req.params.org_id);

    const org_id = req.params.org_id;

    const org = await db.orgRepo.findOrgById(org_id);

    // verify user is member of org
    const isMember = org?.members.find(m => m.user_id === req.user.id);
    if (!isMember) {
        Logger.log("OrgRouter:", "Error - user is not a member of the organization");
        respondError(res, StatusCode.UNAUTHORIZED, HttpErrMsg.UNAUTHORIZED);
        return;
    }

    res.send({ data: org });
});

/*
 * create new organization
 */
router.post('/', verifyOrgRequestBody, async (req, res) => {
    let { name, contact_email, contact_phone } = req.body as OrgRequestBody;

    Logger.log('OrgRouter:', "Creating org with name", name);

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

    Logger.log('OrgRouter:', "Created org with name", org.name);

    res.status(StatusCode.CREATED).send();
});

export default router;
