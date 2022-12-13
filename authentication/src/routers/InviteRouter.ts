import { Router } from 'express';
import {
    verifyInviteAnswerRequestBody,
    verifyInviteDeleteRequestBody,
    verifyInviteRequestBody
} from "../util/middleware.js";
import {
    InviteAnswerRequestBody,
    InviteDeleteRequestBody,
    InviteRequestBody,
    InviteResponseBody
} from "../util/interfaces.js";
import {authorizeOrgModerator, partitionEmails, respondError} from "../util/helpers.js";
import db from "../database/DatabaseGateway.js";
import {HttpErrMsg, StatusCode} from "../util/enums.js";
import Logger from "../util/Logger.js";

const router = Router();

/*
 * fetch invites for logged-in user
 */
router.get('/', async (req, res) => {
    Logger.log("InviteRouter", "Fetching logged-in users's invites");
    const invites = await db.inviteRepo.findInvitesByEmail(req.user.email);
    res.send({ data: invites });
});

/*
 * fetch pending invites for an organization
 */
router.get('/:org_id', async (req, res) => {
    const { org_id } = req.params;

    Logger.log("InviteRouter", "Fetching pending invites for org with ID", org_id);

    if (!org_id) {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.INVALID_QUERY);
        return;
    }

    const isMod = await authorizeOrgModerator(res, req.user, org_id)
    if (!isMod) return;

    const invites = await db.inviteRepo.findManyInvitesByOrg_id(org_id);
    res.send({ data: invites });
});


/*
 * invite users to an organizations
 */
router.post('/', verifyInviteRequestBody, async (req, res) => {

    const orgMod = req.user;
    const request = req.body as InviteRequestBody;

    const isMod = await authorizeOrgModerator(res, orgMod, request.org_id)
    if (!isMod) return;

    // filter valid and invalid email addresses
    const { valid: validEmails, invalid: invalidEmails } = partitionEmails(request.emails);

    // find existing users that are being invited
    const invitedUsers = await db.userRepo.findManyUsersByEmail(validEmails);

    // filter users that are already in the organization
    const usersInOrg = invitedUsers
        .filter(user => user.orgs.find(o => o.organization_id === request.org_id))
        .map(user => user.email);

    // filter out the remaining users that can be invited
    const emailsNotInOrg = validEmails.filter(email => !usersInOrg.find(e => e === email))

    // find active invitations among provided emails
    const previousInvites = await db.inviteRepo.findManyInvitesByOrg_idAndEmails(request.org_id, emailsNotInOrg);

    // filter emails based on existing invitations in the last 24 hours
    const tooEarly = previousInvites
        .filter(inv => Date.now() - inv.sent_at.getTime() < 1000 * 60 * 60 * 24)
        .map(inv => inv.email);

    const canBeInvited = emailsNotInOrg.filter(email => !tooEarly.find(e => e === email));

    for (const email of canBeInvited) {
        db.inviteRepo.upsertInvite(request.org_id, email).catch();
    }

    const responseBody: InviteResponseBody = {}
    if (invalidEmails.length > 0) responseBody.invalid       = invalidEmails;
    if (canBeInvited.length > 0)  responseBody.invited       = canBeInvited;
    if (usersInOrg.length > 0)    responseBody.alreadyJoined = usersInOrg;
    if (tooEarly.length > 0)      responseBody.tooEarly      = tooEarly;

    res.status(StatusCode.OK).send({ data: responseBody });
});


/*
 * accept or decline an invitation to an organization
 */
router.post('/answer', verifyInviteAnswerRequestBody, async (req, res) => {

    const user = req.user;
    const { org_id, answer } = req.body as InviteAnswerRequestBody;

    const invite = await db.inviteRepo.findInviteByOrg_idAndEmail(org_id, user.email);

    if (!invite) {
        respondError(res, StatusCode.NOT_FOUND, HttpErrMsg.RESOURCE_NOT_FOUND);
        return;
    }

    if (answer) {
        db.orgRepo.upsertOrgUser(org_id, user.id).catch();
    }
    db.inviteRepo.deleteInviteByOrg_idAndEmail(org_id, user.email).catch();

    res.status(StatusCode.NO_CONTENT).send();
});

/*
 * delete pending invitation (used by orgs to un-invite)
 */
router.delete('/', verifyInviteDeleteRequestBody, async (req, res) => {
    const orgMod = req.user;
    const request = req.body as InviteDeleteRequestBody;

    const isMod = await authorizeOrgModerator(res, orgMod, request.org_id)
    if (!isMod) return;

    await db.inviteRepo.deleteManyInvitesByOrg_idAndEmail(request.org_id, request.emails);

    Logger.log("InviteRouter:", "Deleted invites to", request.emails, "by organization with id", request.org_id)
    res.status(StatusCode.NO_CONTENT).send();
});

export default router;
