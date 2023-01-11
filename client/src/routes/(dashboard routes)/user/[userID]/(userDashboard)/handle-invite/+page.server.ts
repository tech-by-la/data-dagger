import type {PageServerLoad} from "./$types";
import {type Actions, fail, redirect} from "@sveltejs/kit";
import {StatusCode, StatusMessage} from "$lib/server/util/enums";
import db from '$lib/server/database/DatabaseGateway';
import Logger from "$lib/server/util/Logger";

export const load: PageServerLoad = () => {
    throw redirect(302, `../`);
}

export const actions: Actions = {
    accept: async ({request, locals}) => {
        const form = await request.formData();
        const org_id = form.get('org_id');

        if (!org_id  || typeof org_id !== "string") {
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }

        const invite = await db.inviteRepo.findInviteByOrg_idAndEmail(org_id, locals.user.email);

        if (!invite) {
            return fail(StatusCode.NOT_FOUND, { message: StatusMessage.NOT_FOUND });
        }

        db.orgRepo.upsertOrgUser(org_id, locals.user.sub).catch();
        db.inviteRepo.deleteInviteByOrg_idAndEmail(org_id, locals.user.email).catch();

        Logger.success('User', locals.user.first_name, locals.user.last_name, 'with email', locals.user.email, 'successfully joined an organization with id', org_id);
    },

    decline: async ({request, locals}) => {
        const form = await request.formData();
        const org_id = form.get('org_id');

        if (!org_id  || typeof org_id !== "string") {
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }

        const invite = await db.inviteRepo.findInviteByOrg_idAndEmail(org_id, locals.user.email);
        if (!invite) {
            return fail(StatusCode.NOT_FOUND, { message: StatusMessage.NOT_FOUND });
        }

        db.inviteRepo.deleteInviteByOrg_idAndEmail(org_id, locals.user.email).catch();
        Logger.success('User', locals.user.first_name, locals.user.last_name, 'with email', locals.user.email, 'successfully declined an invitation to join organization with id', org_id);
    }
}
