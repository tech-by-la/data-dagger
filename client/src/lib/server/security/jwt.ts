import type { Algorithm } from "jsonwebtoken";
import jwt from 'jsonwebtoken';

import { PUBLIC_API_URL } from "$env/static/public";
import PublicKey from '$lib/server/security/PublicKey';

const jwtVerifyOptions = {
    issuer: "TechByLA",
    algorithm: "RS256" as Algorithm,
}
export const verifyJwt = async (token: string | undefined) => {
    if (!token) return null;

    const publicKey = await PublicKey.getJwtKey();
    return new Promise((accept) => {
        jwt.verify(token, publicKey, jwtVerifyOptions, (error, decoded) => {
            if (error) accept(null);
            else accept(decoded);
        });
    });
}

export const renewJwt = async () => {
    await fetch(PUBLIC_API_URL + '/api/auth/renew', {
        method: 'POST',
    });
}
