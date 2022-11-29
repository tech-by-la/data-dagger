import { Router } from 'express';
import {
    authenticate,
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

const router = Router();

router.get('/', authenticate, async (req, res) => {
    const { org_id } = req.query;

    if (!org_id || typeof org_id !== "string") {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.INVALID_QUERY);
        return;
    }

    if (!await authorizeOrgModerator(res, req.user, org_id)) {
        return;
    }

    const invites = await db.inviteRepo.findManyInvitesByOrg_id(org_id);
    res.send({ data: invites });
});

router.post('/', authenticate, verifyInviteRequestBody, async (req, res) => {

    const orgMod = req.user;
    const request = req.body as InviteRequestBody;

    if (!await authorizeOrgModerator(res, orgMod, request.org_id)) {
        return;
    }

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

router.post('/answer', authenticate, verifyInviteAnswerRequestBody, async (req, res) => {

    const user = req.user;
    const { org_id, answer } = req.body as InviteAnswerRequestBody;

    const invite = await db.inviteRepo.findInviteByOrg_idAndEmail(org_id, user.email);

    if (!invite) {
        respondError(res, StatusCode.FORBIDDEN, HttpErrMsg.PERMISSION_DENIED);
        return;
    }

    if (answer) {
        db.orgRepo.upsertOrgUser(org_id, user.id).catch();
    }
    db.inviteRepo.deleteInviteByOrg_idAndEmail(org_id, user.email).catch();

    res.status(StatusCode.NO_CONTENT).send();
});

router.delete('/', authenticate, verifyInviteDeleteRequestBody, async (req, res) => {
    const orgMod = req.user;
    const request = req.body as InviteDeleteRequestBody;

    if (! await authorizeOrgModerator(res, orgMod, request.org_id)) {
        return;
    }

    await db.inviteRepo.deleteInviteByOrg_idAndEmail(request.org_id, request.email);
    res.status(StatusCode.NO_CONTENT).send();
});

export default router;
