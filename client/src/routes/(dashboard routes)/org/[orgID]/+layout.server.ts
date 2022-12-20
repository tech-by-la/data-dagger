import type {LayoutServerLoad} from './$types';
import db from '$lib/server/database/DatabaseGateway';
import {error} from "@sveltejs/kit";
import {StatusCode, StatusMessage} from "$lib/server/util/enums";

export const load: LayoutServerLoad = async ({params, locals, parent}) => {
	await parent();

	const fetchOrg = async () => {
		const org_id = params.orgID || '';
		const org = await db.orgRepo.findOrgById(org_id);

		// Authorize
		if (!org || !locals.user || !org.members.find(m => m.user_id === locals.user.sub)) {
			throw error(
				!org ? StatusCode.NOT_FOUND : StatusCode.UNAUTHORIZED,
				{ message: !org ? StatusMessage.NOT_FOUND : StatusMessage.UNAUTHORIZED }
			);
		}

		return org;
	}

	return {
		organization: fetchOrg()
	};
};
