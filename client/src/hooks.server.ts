import type {Handle, HandleFetch} from "@sveltejs/kit";
import {renewJwt, verifyJwt} from "$lib/server/security/jwt";
import {PUBLIC_API_URL} from "$env/static/public";

export const handle: Handle = async ({ event, resolve }) => {

    const refreshToken = event.cookies.get('refreshToken');
    let user = await verifyJwt(event.cookies.get('idToken'));
    if (!user && refreshToken) {
        await renewJwt();
        user = await verifyJwt(event.cookies.get('idToken'));
    }

    event.locals.user = user;
    return resolve(event);
}

export const handleFetch: HandleFetch = ({ event, request, fetch }) => {
    if (request.url.startsWith(PUBLIC_API_URL)) {
        request.headers.set('cookie', event.request.headers.get('cookie') || '');
    }

    return fetch(request);
}

