import type {Handle} from "@sveltejs/kit";
import Jwt from "$lib/server/security/jwt";
import {Cookies} from "$lib/server/util/enums";
import {validateRefreshToken} from "$lib/server/util/helpers";
import db from '$lib/server/database/DatabaseGateway';
import GeoServer from "$lib/server/geoserver/GeoServer";

await db.initDb();
await GeoServer.REST.init();

export const handle = (async ({ event, resolve }) => {

    // renew idToken using the refreshToken
    const verifyUser = async () => {
        const idToken = event.cookies.get(Cookies.ID_TOKEN);
        const refreshToken = event.cookies.get(Cookies.REFRESH_TOKEN);

        let user;
        if (idToken) user = await Jwt.verifyIdToken(idToken);

        if (!user && refreshToken) {

            const verified = await validateRefreshToken(refreshToken);

            if (!verified) {
                event.cookies.delete(Cookies.ID_TOKEN, { path: '/', httpOnly: true, secure: false });
                event.cookies.delete(Cookies.REFRESH_TOKEN, { path: '/', httpOnly: true, secure: false });
                return;
            }

            const { user: verifiedUser, newToken: newRefreshToken } = verified;

            const newIdToken = await Jwt.signIdToken(verifiedUser);

            if (!newIdToken || !newRefreshToken) {
                event.cookies.delete(Cookies.ID_TOKEN, { path: '/', httpOnly: true, secure: false });
                event.cookies.delete(Cookies.REFRESH_TOKEN, { path: '/', httpOnly: true, secure: false });
                return;
            }

            user = Jwt.verifyIdToken(newIdToken);
            event.cookies.set(Cookies.ID_TOKEN, newIdToken, { maxAge: 900, path: '/', httpOnly: true, secure: false });
            event.cookies.set(Cookies.REFRESH_TOKEN, newRefreshToken, { maxAge: 60 * 60 * 24 * 365, path: '/', httpOnly: true, secure: false });
        }
        return user;
    }

    event.locals.user = await verifyUser();
    return resolve(event);
}) satisfies Handle;
