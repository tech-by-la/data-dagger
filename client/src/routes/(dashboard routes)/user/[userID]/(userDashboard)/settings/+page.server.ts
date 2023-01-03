import type {Actions} from "@sveltejs/kit";
import db from "$lib/server/database/DatabaseGateway";
import {redirect} from "@sveltejs/kit";
import {Cookies} from "$lib/server/util/enums";

export const actions: Actions = {
    logoutEverywhere: async ({locals, cookies}) => {

        db.refreshTokenRepo.deleteRefreshTokensByUser(locals.user.sub);

        cookies.delete(Cookies.ID_TOKEN, { path: '/', httpOnly: true, secure: false });
        cookies.delete(Cookies.REFRESH_TOKEN, { path: '/', httpOnly: true, secure: false });
        throw redirect(302, '/');
    }
}
