import {PUBLIC_API_URL} from "$env/static/public";

/*
 * Fetch method that automatically attempt to renew idToken if the request return unauthorized and retries the request
 * @params path: string, body: object, method: string (default: GET)
 */
export const safeFetch = async (path: string, body: object, method = 'GET') => {
    const response = await handleFetch(path, body, method, true);
    if (response.status !== 401) return response;
    await refreshIdToken();
    return handleFetch(path, body, method, true);
}
const handleFetch = async (path: string, body: object, method = 'GET', useCredentials = false) => {
    return await fetch(PUBLIC_API_URL + path, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: useCredentials ? "include" : "omit",
        body: JSON.stringify(body),
    });
}

const refreshIdToken = async () => {
    return await fetch(PUBLIC_API_URL + '/auth/renew', {
        method: 'POST',
        credentials: "include"
    });
}
