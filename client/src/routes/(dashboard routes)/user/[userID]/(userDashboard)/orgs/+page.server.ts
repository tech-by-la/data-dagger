import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userOrgs = locals.user.orgs
	return {
		userOrgs : userOrgs
	};
};
