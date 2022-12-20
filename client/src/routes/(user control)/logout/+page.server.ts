import type {PageServerLoad} from "./$types";
import { redirect, type Actions } from '@sveltejs/kit';
import {Cookies} from "$lib/server/util/enums";
import db from '$lib/server/database/DatabaseGateway';

export const load: PageServerLoad = async () => {

	return {}
}

export const actions: Actions = {
    default: async ({cookies}) => {

		const refreshToken = cookies.get(Cookies.REFRESH_TOKEN);

		if (refreshToken) {
			const token = await db.refreshTokenRepo.findRefreshTokenByToken(refreshToken);
			if (token) {
				db.refreshTokenRepo.deleteRefreshTokensByUserAndFamily(token.user_id, token.family);
				return token;
			}
		}

		cookies.delete('idToken', { path: '/' });
		cookies.delete('refreshToken', { path: '/' });
		throw redirect(302, '/');
	}
};
