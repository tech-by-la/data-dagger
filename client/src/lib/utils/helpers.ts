import {PUBLIC_API_URL} from "$env/static/public";

export const handleFetch = async (URL: string, body: object, method = 'GET', useCredentials = false) => {
    return await fetch(URL, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: useCredentials ? "include" : "omit",
        body: JSON.stringify(body),
    });
}

export const refreshIdToken = async () => {
    return await fetch(PUBLIC_API_URL + '/auth/renew', {
        method: 'POST',
        credentials: "include"
    });
}

export const safeFetch = async (URL: string, body: object, method = 'GET') => {
    const response = await handleFetch(URL, body, method, true);
    if (response.status !== 401) return response;
    await refreshIdToken();
    return handleFetch(URL, body, method, true);
}
