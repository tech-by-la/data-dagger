import {Router} from 'express';
import {
    authenticate, verifyInviteAnswerBody,
    verifyInviteRequestBody,
    verifyOrgRequestBody
} from "../util/middleware.js";
import {InviteAnswerRequestBody, InviteRequestBody, InviteResponseBody, OrgRequestBody} from "../util/interfaces.js";
import db from '../database/DatabaseGateway.js'
import {partitionEmails, respondError} from "../util/helpers.js";
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

router.post('/invite', authenticate, verifyInviteRequestBody, async (req, res) => {

    const orgMod = req.user;
    const request = req.body as InviteRequestBody;

    const org = await db.orgRepo.findOrgById(request.org_id);
    const orgRole = orgMod.orgs.find(o => o.org_id === org?.id)?.role;

    // Must be OWNER or MODERATOR to send invites
    if ((orgRole !== "OWNER" && orgRole !== "MODERATOR") || !org) {
        respondError(res, StatusCode.FORBIDDEN, HttpErrMsg.PERMISSION_DENIED);
        return;
    }

    // filter valid and invalid email addresses
    const { valid: validEmails, invalid: invalidEmails } = partitionEmails(request.emails);

    // find existing users that are being invited
    const invitedUsers = await db.userRepo.findManyUsersByEmail(validEmails);

    // filter users that are already in the organization
    const usersInOrg = invitedUsers
        .filter(user => user.orgs.find(o => o.organization_id === org.id))
        .map(user => user.email);

    // filter out the remaining users that can be invited
    const emailsNotInOrg = validEmails.filter(email => !usersInOrg.find(e => e === email))

    // find active invitations among provided emails
    const previousInvites = await db.inviteRepo.findManyInvitesByOrg_idAndEmails(org.id, emailsNotInOrg);

    // filter emails based on existing invitations in the last 24 hours
    const tooEarly = previousInvites
        .filter(inv => Date.now() - inv.sent_at.getTime() < 1000 * 60 * 60 * 24)
        .map(inv => inv.email);

    const canBeInvited = emailsNotInOrg.filter(email => !tooEarly.find(e => e === email));

    for (const email of canBeInvited) {
        db.inviteRepo.upsertInvite(org.id, email).catch();
    }

    const responseBody: InviteResponseBody = {}
    if (invalidEmails.length > 0) responseBody.invalid       = invalidEmails;
    if (canBeInvited.length > 0)  responseBody.invited       = canBeInvited;
    if (usersInOrg.length > 0)    responseBody.alreadyJoined = usersInOrg;
    if (tooEarly.length > 0)      responseBody.tooEarly      = tooEarly;

    res.status(StatusCode.OK).send({ data: responseBody });
});

router.post('/answer-invite', authenticate, verifyInviteAnswerBody, async (req, res) => {

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

export default router;
