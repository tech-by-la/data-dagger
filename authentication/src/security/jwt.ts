import jwt, {Algorithm, JwtPayload, SignOptions, VerifyOptions} from 'jsonwebtoken';
import fs from 'fs';

import {JwtUserPayload, RefreshTokenPayload, UserWithRoles} from "../util/interfaces";
import {ErrMsg, Warnings} from "../util/enums.js";
import db from '../database/DatabaseGateway.js';
import {RefreshToken} from "@prisma/client";

interface IJwtUtil {
    verifyEnv(): Promise<void>;
    getLoginJwt(user: UserWithRoles): Promise<string | null>;
    getNewRefreshTokenFamily(user_id: string): Promise<RefreshToken | null>;
    renewRefreshToken(user_id: string, token: RefreshToken): Promise<RefreshToken | null>;
    verifyJwt(token: string): Promise<string | null>;
    verifyRefreshToken(token: string): Promise<JwtPayload | null>;
}

class JwtUtil implements IJwtUtil {
    private privateJwtKey: Buffer = Buffer.from([]);
    private publicJwtKey: Buffer = Buffer.from([]);
    private privateRefKey: Buffer = Buffer.from([]);
    private publicRefKey: Buffer = Buffer.from([]);

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
        maxAge: this.refreshTokenSignOptions.expiresIn,
        algorithms: [this.refreshTokenSignOptions.algorithm as Algorithm],
    }

    constructor() {
        this.readKeys().then();
    }

    private async readKeys() {
        await fs.readFile("src/security/keystore/private-jwt.pem",(err, data) => {
            if (err) {
                this.privateJwtKey = Buffer.from([]);
                console.warn(Warnings.MISSING_PRIVATE_JWT_KEY);
            } else {
                this.privateJwtKey = data;
            }
        });

        await fs.readFile("src/security/keystore/public-jwt.pem", (err, data) => {
            if (err) {
                this.publicJwtKey = Buffer.from([]);
                console.warn(Warnings.MISSING_PUBLIC_JWT_KEY);
            } else {
                this.publicJwtKey = data;
            }
        });

        await fs.readFile("src/security/keystore/private-ref.pem",(err, data) => {
            if (err) {
                this.privateRefKey = Buffer.from([]);
                console.warn(Warnings.MISSING_PRIVATE_REF_KEY);
            } else {
                this.privateRefKey = data;
            }
        });

        await fs.readFile("src/security/keystore/public-ref.pem", (err, data) => {
            if (err) {
                this.publicRefKey = Buffer.from([]);
                console.warn(Warnings.MISSING_PUBLIC_REF_KEY);
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

    public getPublicJwtKey() {
        return this.publicJwtKey;
    }

    public getLoginJwt(user: UserWithRoles | null) {
        return new Promise<string | null>((accept) => {
            if (!user || !user.id || !user.email || !user.roles) return accept(null);

            const payload: JwtUserPayload = {
                id: user.id,
                email: user.email,
                roles: user.roles.map(role => role.name),
            }

            jwt.sign(payload, this.privateJwtKey, { ...this.jwtSignOptions, subject: user.email}, (error, encoded) => {
                if (error) accept(null);
                else accept(encoded as string);
            });
        });
    }

    public getNewRefreshTokenFamily(user_id: string) {
        const payload: RefreshTokenPayload = { id: user_id }

        return new Promise<RefreshToken | null>((accept) => {
            jwt.sign(payload, this.privateRefKey, { ...this.refreshTokenSignOptions, subject: user_id}, async (error, encoded) => {
                if (error || !encoded) accept(null);
                else {
                    const token = await db.refreshTokenRepo.startNewRefreshTokenFamily(user_id, encoded);
                    accept(token);
                }
            });
        });
    }

    public renewRefreshToken(user_id: string, old_token: RefreshToken) {
        const payload: RefreshTokenPayload = { id: user_id }

        return new Promise<RefreshToken | null>((accept) => {
            jwt.sign(payload, this.privateRefKey, { ...this.jwtSignOptions, subject: user_id}, async (error, encoded) => {
                if (error || !encoded) accept(null);
                else {
                    const new_token = await db.refreshTokenRepo.renewRefreshToken(old_token, encoded);
                    accept(new_token);
                }
            });
        });
    }

    public verifyJwt(token: string) {
        return new Promise<string | null>((accept) => {
            jwt.verify(token, this.publicJwtKey, this.jwtVerifyOptions, async (error, decoded) => {
                if (error) accept(null);
                else {
                    const { sub } = decoded as JwtPayload;
                    if (!sub) return;

                    const user = await db.userRepo.findUserByEmail(sub);
                    if (user && user.enabled) accept(decoded as string);
                    else accept(null);
                }
            });
        });
    }

    public verifyRefreshToken(token: string) {
        return new Promise<JwtPayload | null>((accept) => {
            jwt.verify(token, this.publicRefKey, this.refreshTokenVerifyOptions, async (error, decoded) => {
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
}

export default new JwtUtil();
