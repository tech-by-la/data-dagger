// import type { PageServerLoad } from './$types';
// import db from '$lib/server/database/DatabaseGateway';

// export const load: PageServerLoad = async ({parent, locals}) => {
// 	await parent();

// 	return {
// 		projects: db.projectRepo.findAllByUser_id(locals.user.sub),
// 	}
// };
