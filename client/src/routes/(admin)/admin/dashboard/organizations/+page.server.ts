import type {PageServerLoad} from "./$types";
import db from '$lib/server/database/DatabaseGateway';
import type {Actions} from "@sveltejs/kit";
import {StatusCode, StatusMessage, UserRoles} from "$lib/server/util/enums";
import Logger from "$lib/server/util/Logger";
import {fail} from "@sveltejs/kit";

export const load: PageServerLoad = async ({parent}) => {
    await parent();

    return {
        organizations: db.orgRepo.getAll(),
    }
}

export const actions: Actions = {
    default: async ({request, locals}) => {
        const form = await request.formData();
        const enabled = form.get('enabled');
        const org_id = form.get('org_id');

        const admin = locals.user;

        // Not ADMIN? DENIED!
        if (!admin.roles.find((r: string) => r === UserRoles.SUPER_ADMIN || r === UserRoles.ADMIN)) {
            Logger.log('AdminRouter:', "Unauthorized attempt to change user status");
            return fail(StatusCode.UNAUTHORIZED, { message: StatusMessage.UNAUTHORIZED });
        }

        if ((enabled !== 'true' && enabled !== 'false') || !org_id || typeof org_id !== "string") {
            Logger.log('AdminRouter:', "Bad Request enabling/disabling an org");
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }

        const org = await db.orgRepo.findOrgById(org_id);
        if (!org) {
            Logger.log("AdminRouter", "Could not find an org to", enabled === "true" ? "enable" : "disable");
            return fail(StatusCode.NOT_FOUND, { message: StatusMessage.NOT_FOUND });
        }

        org.enabled = enabled === 'true';
        const success = await db.orgRepo.updateOrg(org).catch();
        if (!success) {
            Logger.error("AdminRouter:", "Internal error - could not update org when querying database");
            return fail(StatusCode.INTERNAL_SERVER_ERROR, { message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    }
}
