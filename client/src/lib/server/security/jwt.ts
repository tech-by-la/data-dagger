import type {Algorithm, JwtPayload, SignOptions, VerifyOptions} from 'jsonwebtoken';
import type {JwtUserPayload, RefreshTokenPayload, UserInfo} from "../util/interfaces.js";
import type {RefreshToken} from "@prisma/client";
import jwt from 'jsonwebtoken'
import fs from 'fs';

import {ErrMsg, Warnings} from "../util/enums.js";
import db from '../database/DatabaseGateway.js';
import Snowflakes from "../util/snowflakes.js";
import Logger from "../util/Logger.js";

interface IJwtUtil {
    verifyEnv(): Promise<void>;
    signIdToken(user: UserInfo): Promise<string | null>;
    signNewRefreshTokenFamily(user_id: string): Promise<string | null>;
    renewRefreshToken(user_id: string, token: RefreshToken): Promise<string | null>;
    verifyIdToken(token: string): Promise<JwtPayload | null>;
    verifyRefreshToken(token: string): Promise<JwtPayload | null>;
    decodeToken(token: string): JwtPayload;
}

class JwtUtil implements IJwtUtil {
    private privateJwtKey: Buffer = Buffer.from([])
    private publicJwtKey:  Buffer = Buffer.from([])
    private privateRefKey: Buffer = Buffer.from([])
    private publicRefKey:  Buffer = Buffer.from([])

    private jwtSignOptions: SignOptions = {
        issuer: process.env.JWT_ISSUER,
        expiresIn: `${process.env.JWT_EXPIRES}m`,
        algorithm: `${process.env.JWT_ALGORITHM}` as Algorithm,
    }

    private refreshTokenSignOptions: SignOptions = {
        issuer: this.jwtSignOptions.issuer,
        expiresIn: `1y`,
        algorithm: `${process.env.JWT_ALGORITHM}` as Algorithm,
    }

    private jwtVerifyOptions: VerifyOptions = {
        issuer: this.jwtSignOptions.issuer,
        maxAge: this.jwtSignOptions.expiresIn,
        algorithms: [this.jwtSignOptions.algorithm as Algorithm],
    }

    private refreshTokenVerifyOptions: VerifyOptions = {
        issuer: this.refreshTokenSignOptions.issuer,
        algorithms: [this.refreshTokenSignOptions.algorithm as Algorithm],
    }

    constructor() {
        this.readKeys()
    }

    private readKeys() {
        fs.readFile("src/lib/server/security/keystore/private-jwt.pem",(err, data) => {
            if (err) {
                this.privateJwtKey = Buffer.from([]);
                Logger.error(Warnings.MISSING_PRIVATE_JWT_KEY);
            } else {
                this.privateJwtKey = data
            }
        });

        fs.readFile("src/lib/server/security/keystore/public-jwt.pem", (err, data) => {
            if (err) {
                this.publicJwtKey = Buffer.from([]);
                Logger.error(Warnings.MISSING_PUBLIC_JWT_KEY);
            } else {
                this.publicJwtKey = data;
            }
        });

        fs.readFile("src/lib/server/security/keystore/private-ref.pem",(err, data) => {
            if (err) {
                this.privateRefKey = Buffer.from([]);
                Logger.error(Warnings.MISSING_PRIVATE_REF_KEY);
            } else {
                this.privateRefKey = data;
            }
        });

        fs.readFile("src/lib/server/security/keystore/public-ref.pem", (err, data) => {
            if (err) {
                this.publicRefKey = Buffer.from([]);
                Logger.error(Warnings.MISSING_PUBLIC_REF_KEY);
            } else {
                this.publicRefKey = data;
            }
        });
    }

    public async verifyEnv(): Promise<void> {
        if (!process.env.JWT_ISSUER) {
            throw new Error(ErrMsg.MISSING_ENV + " JWT_ISSUER");
        }
        if (!process.env.JWT_EXPIRES) {
            throw new Error(ErrMsg.MISSING_ENV + " JWT_EXPIRES");
        }
        if (!process.env.JWT_ALGORITHM) {
            throw new Error(ErrMsg.MISSING_ENV + " JWT_ALGORITHM");
        }
    }

    public signIdToken(user: UserInfo | null) {
        return new Promise<string | null>((accept) => {
            if (
                !user || !user.id || !user.email || !user.first_name ||
                !user.last_name || !user.roles || !user.orgs
            ) return accept(null);

            const payload: JwtUserPayload = {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                roles: user.roles.map(role => role.name),
                orgs: user.orgs.map(org => { return {org_id: org.organization_id, role: org.org_role_id} }),
            }

            jwt.sign(payload, this.privateJwtKey, { ...this.jwtSignOptions, subject: user.id}, (error, encoded) => {
                if (error) accept(null);
                else accept(encoded as string);
            });
        });
    }

    public signNewRefreshTokenFamily(user_id: string) {
        Logger.log("JWT:", "Signing Refresh Token for user with id", user_id);
        const payload: RefreshTokenPayload = { token: Snowflakes.nextHexId() }

        return new Promise<string | null>((accept) => {
            jwt.sign(payload, this.privateRefKey, { ...this.refreshTokenSignOptions, subject: user_id}, async (error, encoded) => {
                if (error || !encoded) accept(null);
                else {
                    await db.refreshTokenRepo.startNewRefreshTokenFamily(user_id, payload.token);
                    accept(encoded || null);
                }
            });
        });
    }

    public renewRefreshToken(user_id: string, old_token: RefreshToken) {
        const payload: RefreshTokenPayload = { token: Snowflakes.nextHexId() }

        return new Promise<string | null>((accept) => {
            jwt.sign(payload, this.privateRefKey, { ...this.refreshTokenSignOptions, subject: user_id}, async (error, encoded) => {
                if (error || !encoded) accept(null);
                else {
                    await db.refreshTokenRepo.renewRefreshToken(old_token, payload.token);
                    accept(encoded);
                }
            });
        });
    }

    public verifyIdToken(token: string) {
        return new Promise<JwtPayload | null>((accept) => {
            jwt.verify(token, this.publicJwtKey, this.jwtVerifyOptions, async (error, decoded) => {
                if (error) accept(null);
                else {
                    const { sub } = decoded as JwtPayload;
                    if (!sub) return;

                    const user = await db.userRepo.findUserById(sub);
                    if (user && user.enabled) accept(decoded as JwtPayload);
                    else accept(null);
                }
            });
        });
    }

    public verifyRefreshToken(refreshToken: string) {
        return new Promise<JwtPayload | null>((accept) => {
            jwt.verify(refreshToken, this.publicRefKey, this.refreshTokenVerifyOptions, async (error, decoded) => {
                if (error) {
                    Logger.error("RefreshToken:", "VerifyError -", error)
                    accept(null);
                }
                else {
                    const { sub, token } = decoded as JwtPayload;
                    if (!sub || !token) {
                        accept(null);
                        return;
                    }

                    const user = await db.userRepo.findUserById(sub);
                    const tokenObj = await db.refreshTokenRepo.findRefreshTokenByToken(token);

                    if (!tokenObj || !tokenObj.expires) {
                        accept(null);
                        return;
                    }
                    const expired = new Date(Number.parseInt(tokenObj.expires.toString())).getTime() < Date.now();
                    if (!user || !user.enabled || !tokenObj || expired) {
                        accept(null);
                    } else if (!tokenObj.valid) {
                        Logger.warn("RefreshToken Warning", `A RefreshToken was used more than once for user with email ${user.email}`);
                        accept(null)
                    } else {
                        Logger.log("RefreshToken:", `Successfully renewed refresh token for user with email ${user.email}`);
                        accept(decoded as JwtPayload);
                    }
                }
            });
        });
    }

    public decodeToken(token: string) {
        return jwt.decode(token) as JwtPayload;
    }
}

export default new JwtUtil();
