import type {PageServerLoad} from "./$types";
import type {Invite} from "@prisma/client";
import type {Actions} from "@sveltejs/kit";

import db from '$lib/server/database/DatabaseGateway';
import {fail} from "@sveltejs/kit";
import {OrgRoles, StatusMessage} from "$lib/server/util/enums";

export const load: PageServerLoad = ({params}) => {

    const fetchInvites = async () => {
        return await db.inviteRepo.findManyInvitesByOrg_id(params.orgID);
    }

    return {
        invites: fetchInvites(),
    }
}

export const actions: Actions = {
    default: async ({request, locals, params}) => {
        const data = await request.formData();
        const selected = data.get('selected') as string;

        const emails = selected.split(',');

        if (!emails) {
            return fail(400, { message: StatusMessage.BAD_REQUEST });
        }

        const orgId = params.orgID;
        if (!orgId) {
            return fail(500, { message: StatusMessage.INTERNAL_SERVER_ERROR });
        }

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

        await db.inviteRepo.deleteManyInvitesByOrg_idAndEmail(org.id, emails);
    }
}
