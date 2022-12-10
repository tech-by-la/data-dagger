import type { Algorithm } from "jsonwebtoken";
import jwt from 'jsonwebtoken';

import { PUBLIC_API_URL } from "$env/static/public";
import PublicKey from '$lib/server/security/PublicKey';
import type {RequestEvent} from "@sveltejs/kit";
import type {LoginResponse} from "$lib/server/interfaces/interfaces";

const jwtVerifyOptions = {
    issuer: "TechByLA",
    algorithm: "RS256" as Algorithm,
}
export const verifyJwt = async (token: string | undefined) => {
    if (!token) return null;

    const publicKey = await PublicKey.getJwtKey();
    if (!publicKey) {
        console.log('idToken Verify Error:', "No publickey");
        return null;
    }
    return new Promise((accept) => {
        jwt.verify(token, publicKey, jwtVerifyOptions, (error, decoded) => {
            if (error) {
                console.log("idToken Verify Error", error);
                accept(null);
            }
            else accept(decoded);
        });
    });
}

export const renewJwt = async (event: RequestEvent): Promise<LoginResponse | null> => {
    const response = await event.fetch(PUBLIC_API_URL + '/auth/renew', {
        method: 'POST',
    });

    if (response.ok) return await response.json();

    console.log('idToken Renew Error:', response);
    return null;
}
