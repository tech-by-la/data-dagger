import type {LayoutServerLoad} from './$types';
import db from '$lib/server/database/DatabaseGateway';
import {error} from "@sveltejs/kit";
import {Cookies} from "$lib/server/util/enums";
import Jwt from "$lib/server/security/jwt";

export const load: LayoutServerLoad = async ({params, cookies}) => {

	const fetchOrg = async () => {
		const org = await db.orgRepo.findOrgById(params.orgID);
		if (!org) {
			throw error(404, { message: "Org not found" });
		}

		const decoded = await Jwt.verifyIdToken(cookies.get(Cookies.ID_TOKEN) || '');
		if (!decoded || !decoded.sub || !org.members.find(m => m.user_id === decoded.sub)) {
			throw error(401, { message: "Unauthorized" });
		}

		return org;
	}

	return {
		organization: fetchOrg()
	};
};
