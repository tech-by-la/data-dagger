import Jwt from "../security/jwt";
import db from '../database/DatabaseGateway';

/**
 * Verifies token validity, then invalidates token and renews it
 * @returns { user, newToken }
 * @param jwt
 */
export const validateRefreshToken = async (jwt: string) => {
    const verified = await Jwt.verifyRefreshToken(jwt);
    if (!verified) return;

    const { token } = verified;
    const refreshToken = await db.refreshTokenRepo.findRefreshTokenByToken(token);
    if (!refreshToken) return;

    // If user doesn't exist or is banned, delete all related refresh tokens
    const user = await db.userRepo.findUserById(refreshToken.user_id);
    if (!user || !user.enabled) {
        db.refreshTokenRepo.deleteRefreshTokensByUser(refreshToken.user_id);
        return;
    }

    // If token is expired or someone used an invalid token, delete token family
    if (!refreshToken.valid || refreshToken.expires < Date.now()) {
        db.refreshTokenRepo.deleteRefreshTokensByUserAndFamily(refreshToken.user_id, refreshToken.family);
        return;
    }

    const newToken = await Jwt.renewRefreshToken(refreshToken.user_id, refreshToken);
    return { user, newToken }
}

export const partitionEmails = (emails: string[]) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const invalid: string[] = [];
    const valid = emails.filter(email => {
        if (pattern.test(String(email).toLowerCase())) return true;
        else invalid.push(email);
    });

    return {valid, invalid}
}

export const excludeKey = <T, K extends keyof T>(object: T, keys: K[]): T => {
    for (const key of keys) {
        delete object[key];
    }
    return object;
}
export const excludeKeys = <T, K extends keyof T>(objects: T[], keys: K[]): T[] => {
    for (const obj of objects) {
        for (const key of keys) {
            delete obj[key];
        }
    }
    return objects;
}
