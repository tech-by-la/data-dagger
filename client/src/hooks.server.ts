import type {Handle} from "@sveltejs/kit";
import {renewJwt, verifyJwt} from "$lib/server/security/jwt";
// import {verifyJwt} from "$lib/server/security/jwt";
export const handle: Handle = async ({ event, resolve }) => {

    const refreshToken = event.cookies.get('refresh_token');
    let user = await verifyJwt(event.cookies.get('jwt'));
    if (!user && refreshToken) {
        await renewJwt();
        user = await verifyJwt(event.cookies.get('jwt'));
    }

    event.locals.user = user;
    return resolve(event);
}

