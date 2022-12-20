import type {Actions} from "@sveltejs/kit";
import db from '$lib/server/database/DatabaseGateway';
import {fail} from "@sveltejs/kit";
import {OrgRoles, StatusMessage} from "$lib/server/util/enums";
import {partitionEmails} from "$lib/server/util/helpers";
import type {InviteResponseBody} from "$lib/server/util/interfaces";

export const actions: Actions = {
    default: async ({request, locals, params}) => {
        const form = await request.formData();

        const data = form.get('emails');

        if (!data || typeof data !== "string") {
            return fail(400, { message: StatusMessage.BAD_REQUEST });
        }

        const orgId = params.orgID || '';
        const org = await db.orgRepo.findOrgById(orgId);

        if (!org) {
            return fail(404, { message: StatusMessage.NOT_FOUND });
        }

        // User's role in org
        const orgRole = org.members.find(m => m.user_id === locals.user.sub)?.org_role_id;

        // Verify org OWNER or MODERATOR
        if (!orgRole || (orgRole !== OrgRoles.OWNER && orgRole !== OrgRoles.MODERATOR)) {
            return fail(401, { message: StatusMessage.UNAUTHORIZED });
        }

        const emails = data.split(',');

        // filter valid and invalid email addresses
        const { valid: validEmails, invalid: invalidEmails } = partitionEmails(emails);

        // find existing users that are being invited
        const invitedUsers = await db.userRepo.findManyUsersByEmail(validEmails);

        // filter users that are already in the organization
        const usersInOrg = invitedUsers
            .filter(user => user.orgs.find(o => o.organization_id === orgId))
            .map(user => user.email);

        // filter out the remaining users that can be invited
        const emailsNotInOrg = validEmails.filter(email => !usersInOrg.find(e => e === email))

        // find active invitations among provided emails
        const previousInvites = await db.inviteRepo.findManyInvitesByOrg_idAndEmails(orgId, emailsNotInOrg);

        // filter emails based on existing invitations in the last 24 hours
        const tooEarly = previousInvites
            .filter(inv => Date.now() - inv.sent_at.getTime() < 1000 * 60 * 60 * 24)
            .map(inv => inv.email);

        const canBeInvited = emailsNotInOrg.filter(email => !tooEarly.find(e => e === email));

        for (const email of canBeInvited) {
            await db.inviteRepo.upsertInvite(orgId, email).catch();
        }

        const responseBody: InviteResponseBody = {}
        if (invalidEmails.length > 0) responseBody.invalid       = invalidEmails;
        if (canBeInvited.length > 0)  responseBody.invited       = canBeInvited;
        if (usersInOrg.length > 0)    responseBody.alreadyJoined = usersInOrg;
        if (tooEarly.length > 0)      responseBody.tooEarly      = tooEarly;

        return { response: responseBody }
    }
}
