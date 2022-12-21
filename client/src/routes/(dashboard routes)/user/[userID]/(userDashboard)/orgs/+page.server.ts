// import type { PageServerLoad } from './$types';
// import db from '$lib/server/database/DatabaseGateway';

// export const load: PageServerLoad = async ({locals, parent}) => {
// 	await parent();

// 	const fetchOrgs = async () => {
// 		return await db.orgRepo.findManyOrgsByUser_id(locals.user.sub);
// 	}

// 	return {
// 		userOrgs: fetchOrgs()
// 	};

// };
