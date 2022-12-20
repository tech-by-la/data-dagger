import type { PageServerLoad } from './$types';
import db from '$lib/server/database/DatabaseGateway';

export const load: PageServerLoad = async ({ locals}) => {

	const fetchOrgs = async () => {
		return await db.orgRepo.findManyOrgsByUser_id(locals.user.sub);
	}

	return {
		userOrgs: fetchOrgs()
	};

};
