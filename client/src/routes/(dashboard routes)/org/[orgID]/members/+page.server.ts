import type {PageServerLoad} from "./$types";
import type {Actions} from "@sveltejs/kit";
import {fail} from "@sveltejs/kit";
import db from '$lib/server/database/DatabaseGateway';
import {OrgRoles, StatusCode, StatusMessage} from "$lib/server/util/enums";

export const load: PageServerLoad = async ({parent}) => {
    await parent();
}

export const actions: Actions = {
    default: async ({request, locals}) => {
        const form = await request.formData();
        const org_id = form.get('org_id');
        const user_id = form.get('user_id');

        if (
            !org_id || typeof org_id !== 'string' ||
            !user_id || typeof user_id !== 'string'
        ) {
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }

        const org = await db.orgRepo.findOrgById(org_id);
        const member = org?.members.find(m => m.user_id === user_id);
        const owner = org?.members.find(m => m.user_id === locals.user.sub);

        // check org and member exists
        if (!org || !member) {
            return fail(StatusCode.NOT_FOUND, { message: StatusMessage.NOT_FOUND });
        }

        // check that the user is an OWNER and that they are not kicking an OWNER
        if (!owner || member.org_role_id === OrgRoles.OWNER) {
            return fail(StatusCode.FORBIDDEN, { message: StatusMessage.FORBIDDEN });
        }

        // kick member and check if query was successful
        const success = await db.orgRepo.kickMember(org.id, member.user_id);
        if (!success) {
            return fail(StatusCode.INTERNAL_SERVER_ERROR, { message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    }
}
