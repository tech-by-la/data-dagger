import type { LayoutServerLoad } from './$types';
import {error} from "@sveltejs/kit";
import {StatusCode, StatusMessage} from "$lib/server/util/enums";

export const load: LayoutServerLoad = async ({ locals, params}) => {
	const userID = locals.user.sub

	if(userID !== params.userID ) {
		throw error(StatusCode.UNAUTHORIZED, { message: StatusMessage.UNAUTHORIZED });
	}
};
