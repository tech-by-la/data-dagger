import type {Actions} from "@sveltejs/kit";
import db from "$lib/server/database/DatabaseGateway";
import {redirect} from "@sveltejs/kit";
import {Cookies} from "$lib/server/util/enums";
import Logger from "$lib/server/util/Logger";

export const actions: Actions = {
    logoutEverywhere: async ({locals, cookies}) => {

        db.refreshTokenRepo.deleteRefreshTokensByUser(locals.user.sub);

        cookies.delete(Cookies.ID_TOKEN, { path: '/', httpOnly: true, secure: false });
        cookies.delete(Cookies.REFRESH_TOKEN, { path: '/', httpOnly: true, secure: false });

        Logger.success('User', locals.user.first_name, locals.user.last_name, 'with email', locals.user.email, 'successfully logged out everywhere');
        throw redirect(302, '/');
    }
}
