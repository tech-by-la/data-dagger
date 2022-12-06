import type { LayoutServerLoad } from './$types';
import {redirect} from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ locals, params}) => {
	const userID = locals.user.sub

	if(userID != params.userID ) {
		throw redirect(302, "/Please-Log-in");
	}
	return {};
};