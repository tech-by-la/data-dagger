import type {LayoutServerLoad} from "./$types";
import db from '$lib/server/database/DatabaseGateway';
import {error} from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({locals, params}) => {

    const org_id = params.orgID || '';
    const org = await db.orgRepo.findOrgById(org_id);

    if (!org || !locals.user || !org.members.find(m => m.user_id === locals.user.sub)) {
        throw error(401, { message: "Unauthorized" });
    }
}
