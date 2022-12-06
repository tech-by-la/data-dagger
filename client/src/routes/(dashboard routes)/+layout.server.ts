import type { LayoutServerLoad } from './$types';
import {redirect} from "@sveltejs/kit";

export const load: LayoutServerLoad = async ( {locals} ) => {
	const user = locals.user;
    if (!user) {
        // TODO: route to '/'
        throw redirect(302, "/Please-Log-in");
    }
	return {
        user: locals.user,
    }
};
