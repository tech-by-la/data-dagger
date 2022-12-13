import type { PageServerLoad } from './$types';
import {PUBLIC_API_URL} from "$env/static/public";
import {error} from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, fetch}) => {
	// const userOrgs = locals.user.orgs

	const fetchOrgs = async () => {
		const response = await fetch(PUBLIC_API_URL + `/auth/orgs`)
		if (!response.ok) throw error(response.status);
		return await response.json();
	}

	return {
		userOrgs: fetchOrgs()
	};
	
};
