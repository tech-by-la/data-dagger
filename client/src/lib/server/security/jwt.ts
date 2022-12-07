import type { Algorithm } from "jsonwebtoken";
import jwt from 'jsonwebtoken';

import PublicKey from '$lib/server/security/PublicKey';
import type {RequestEvent} from "@sveltejs/kit";
import type {LoginResponse} from "$lib/server/interfaces/interfaces";
import {PUBLIC_API_URL} from "$env/static/public";

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

export const renewJwt = async (event: RequestEvent): Promise<LoginResponse | null> => {
    try {
        return await event.fetch(PUBLIC_API_URL + '/auth/renew', {
            method: 'POST',
        })
            .then(res => res.json())
            .then(data => data);
    } catch (err) {
        console.log(err);
        return null;
    }
}
