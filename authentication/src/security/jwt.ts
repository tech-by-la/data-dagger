import jwt, {SignOptions, Algorithm, VerifyOptions, JwtPayload} from 'jsonwebtoken';
import fs from 'fs';

import {JwtUserPayload, UserWithRoles} from "../util/interfaces";
import {ErrMsg, Warnings} from "../util/enums.js";
import db from '../database/DatabaseGateway.js';

interface IJwtUtil {
    verifyEnv(): Promise<void>;
    signJwt(user: UserWithRoles): Promise<string | null>;
    verifyJwt(token: string): Promise<string | null>;
}

class JwtUtil implements IJwtUtil {
    private privateKey: Buffer = Buffer.from([]);
    private publicKey: Buffer = Buffer.from([]);

    private signOptions: SignOptions = {
        issuer: process.env.JWT_ISSUER,
        expiresIn: `${process.env.JWT_EXPIRES}m`,
        algorithm: `${process.env.JWT_ALGORITHM}` as Algorithm,
    }

    private verifyOptions: VerifyOptions = {
        issuer: this.signOptions.issuer,
        maxAge: this.signOptions.expiresIn,
        algorithms: [this.signOptions.algorithm as Algorithm],
    }

    constructor() {
        this.fetchKeys().then();
    }

    private async fetchKeys() {
        await fs.readFile("dist/security/keystore/private.pem",(err, data) => {
            if (err) {
                this.privateKey = Buffer.from([]);
                console.warn(Warnings.MISSING_PRIVATE_KEY);
            } else {
                this.privateKey = data;
            }
        });

        await fs.readFile("dist/security/keystore/public.pem", (err, data) => {
            if (err) {
                this.publicKey = Buffer.from([]);
                console.warn(Warnings.MISSING_PRIVATE_KEY);
            } else {
                this.publicKey = data;
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

    signJwt(user: UserWithRoles) {
        return new Promise<string | null>((accept) => {
            if (!user.id || !user.email || !user.roles) return accept(null);

            const payload: JwtUserPayload = {
                id: user.id,
                email: user.email,
                roles: user.roles.map(role => role.name),
            }

            jwt.sign(payload, this.privateKey, { ...this.signOptions, subject: user.email}, (error, encoded) => {
                if (error) accept(null);
                else accept(encoded as string);
            });
        });
    }

    verifyJwt(token: string) {
        return new Promise<string | null>((accept) => {
            jwt.verify(token, this.publicKey, this.verifyOptions, async (error, decoded) => {
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
}

export default new JwtUtil();
