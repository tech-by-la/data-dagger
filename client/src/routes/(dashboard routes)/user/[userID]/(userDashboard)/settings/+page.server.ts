import type {Actions} from "@sveltejs/kit";
import db from "$lib/server/database/DatabaseGateway";
import {redirect} from "@sveltejs/kit";

export const actions: Actions = {
    logoutEverywhere: async ({locals, cookies}) => {

        db.refreshTokenRepo.deleteRefreshTokensByUser(locals.user.sub);

        cookies.delete('idToken', { path: '/' });
        cookies.delete('refreshToken', { path: '/' });
        throw redirect(302, '/');
    }
}
