import jwt, {Algorithm, JwtPayload, VerifyOptions} from 'jsonwebtoken';
import {response} from "express";

interface IJwt {
    verifyJwt(token: string): {}
}

class Jwt implements IJwt {

    private publicKey: Buffer = Buffer.from([]);

    private jwtVerifyOptions: VerifyOptions = {
        issuer: process.env.JWT_ISSUER,
        algorithms: [process.env.JWT_ALGORITHM as Algorithm],
    }

    constructor() {
        if (!this.jwtVerifyOptions.issuer || !this.jwtVerifyOptions.algorithms) {
            throw Error('Missing JWT setting in environment');
        }
    }

    public async verifyJwt(token: string) {
        if (!this.publicKey+'') await this.fetchPublicJwtKey();

        return new Promise<JwtPayload | null>((accept) => {
            jwt.verify(token, this.publicKey, this.jwtVerifyOptions, async (error, decoded) => {
                if (error) accept(null);
                else accept(decoded as JwtPayload);
            });
        });
    }

    private async fetchPublicJwtKey() {
        const API = process.env.KEY_API || '';
        this.publicKey = await fetch(API)
            .then(response => response.text())
            .then(data => Buffer.from(data))
            .catch((err) => {
                console.log(err)
                return this.publicKey
            });

    }
}

export default new Jwt();
