import type {Handle, HandleFetch} from "@sveltejs/kit";
import {renewJwt, verifyJwt} from "$lib/server/security/jwt";
import {PUBLIC_API_URL} from "$env/static/public";
import type {LoginResponse} from "$lib/server/interfaces/interfaces";

export const handle: Handle = async ({ event, resolve }) => {
    const refreshToken = event.cookies.get('refreshToken');
    let user = await verifyJwt(event.cookies.get('idToken'));

    // renew idToken using the refreshToken
    if (!user && refreshToken) {
        const response: LoginResponse | null = await renewJwt(event);
        if (response) {
            event.cookies.set('idToken', response.idToken, { maxAge: response.expiresIn, path: '/' });
            event.cookies.set('refreshToken', response.refreshToken, { maxAge: 60 * 60 * 24 * 365, path: '/' });
            user = await verifyJwt(response.idToken);
        } else {
            event.cookies.delete('idToken');
            event.cookies.delete('refreshToken');
        }
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

