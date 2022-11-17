import {PrismaClient, RefreshToken} from "@prisma/client";

interface IRefreshTokenRepo {
    renewRefreshToken(token: RefreshToken): Promise<RefreshToken | null>;
    startNewRefreshTokenFamily(user_id: string): Promise<RefreshToken | null>;
    findRefreshTokenByToken(token: string): Promise<RefreshToken | null>;
    findLatestRefreshTokenFamilyByUser(user_id: string): Promise<number | null>;
    deleteRefreshTokensByUser(user_id: string): void;
    deleteRefreshTokensByUserAndFamily(user_id: string, family: number): void;
}

export class RefreshTokenRepo implements IRefreshTokenRepo {
    private readonly db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    /*
     * Creates a new Refresh Token in a new family
     * @param: string
     */
    public async startNewRefreshTokenFamily(user_id: string) {
        const family = await this.findLatestRefreshTokenFamilyByUser(user_id);
        if (!family && family !== 0) return null;

        const expires = Date.now() + 1000 * 60 * 60 * 24 * 365; // one year

        return await this.db.refreshToken
            .create({
                data: {
                    user_id,
                    family: family + 1,
                    iteration: 1,
                    valid: true,
                    expires,
                },
            })
            .catch(() => null);
    }

    /*
     * Invalidates a given refresh token then creates next token in the family
     * @param: RefreshToken
     * @returns: The new token
     */
    public async renewRefreshToken(token: RefreshToken) {
        const expires = Date.now() + 1000 * 60 * 60 * 24 * 365;

        return await this.db.refreshToken
            .update({
                where: { id: token.id },
                data: { valid: false },
            })
            .then(
                async (result) =>
                    await this.db.refreshToken.create({
                        data: {
                            user_id: result.user_id,
                            family: result.family,
                            iteration: result.iteration + 1,
                            valid: true,
                            expires,
                        },
                    }),
            )
            .catch(() => null);
    }

    public async findRefreshTokenByToken(token: string) {
        return await this.db.refreshToken
            .findUnique({
                where: { token },
            })
            .catch(() => null);
    }

    public async findLatestRefreshTokenFamilyByUser(user_id: string) {
        return await this.db.refreshToken
            .aggregate({
                where: { user_id },
                _max: { family: true },
            })
            .then((result) => result._max.family || 0)
            .catch(() => null);
    }

    public deleteRefreshTokensByUser(user_id: string) {
        this.db.refreshToken
            .deleteMany({
                where: { user_id },
            })
            .catch((error) => console.log(error));
    }

    public deleteRefreshTokensByUserAndFamily(user_id: string, family: number) {
        this.db.refreshToken
            .deleteMany({
                where: { user_id, family },
            })
            .catch((error) => console.log(error));
    }
}
