import type {PageServerLoad} from "./$types";
import { redirect, type Actions } from '@sveltejs/kit';
import {Cookies} from "$lib/server/util/enums";
import db from '$lib/server/database/DatabaseGateway';
import Jwt from "$lib/server/security/jwt";

export const load: PageServerLoad = async () => {
	throw redirect(302, '/');
}

export const actions: Actions = {
    default: async ({cookies}) => {

		const refreshToken = cookies.get(Cookies.REFRESH_TOKEN);

		if (refreshToken) {
			const { token: decodedToken } = Jwt.decodeToken(refreshToken);
			const token = await db.refreshTokenRepo.findRefreshTokenByToken(decodedToken);
			if (token) {
				db.refreshTokenRepo.deleteRefreshTokensByUserAndFamily(token.user_id, token.family);
			}
		}

		cookies.delete(Cookies.ID_TOKEN, { path: '/', httpOnly: true, secure: false });
		cookies.delete(Cookies.REFRESH_TOKEN, { path: '/', httpOnly: true, secure: false });
		throw redirect(302, '/');
	}
};
