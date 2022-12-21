import type { LayoutServerLoad } from './$types';
import {error} from "@sveltejs/kit";
import {StatusCode, StatusMessage} from "$lib/server/util/enums";
import db from '$lib/server/database/DatabaseGateway';

export const load: LayoutServerLoad = async ({ locals, params}) => {
	const userID = locals.user.sub

	const fetchOrgs = async () => {
		return await db.orgRepo.findManyOrgsByUser_id(locals.user.sub);
	}

	if(userID !== params.userID ) {
		throw error(StatusCode.UNAUTHORIZED, { message: StatusMessage.UNAUTHORIZED });
	}
	return {
		userOrgs: fetchOrgs()
	};
};
