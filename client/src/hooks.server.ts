import type {Handle} from "@sveltejs/kit";
import {renewJwt, verifyJwt} from "$lib/server/security/jwt";

export const handle: Handle = async ({ event, resolve }) => {

    // const refreshToken = event.cookies.get('refreshToken');
    // let user = await verifyJwt(event.cookies.get('idToken'));
    // if (!user && refreshToken) {
    //     await renewJwt();
    //     user = await verifyJwt(event.cookies.get('idToken'));
    // }
    //
    // event.locals.user = user;
    return resolve(event);
}

