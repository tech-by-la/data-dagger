import type {LayoutServerLoad} from './$types';
import {PUBLIC_API_URL} from "$env/static/public";
import {error} from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({params, fetch}) => {

	const fetchOrg = async () => {
		const response = await fetch(PUBLIC_API_URL + `/auth/orgs/${params.orgID}`)
		if (!response.ok) throw error(response.status);
		return await response.json();
	}

	return {
		organization: fetchOrg()
	};
};
