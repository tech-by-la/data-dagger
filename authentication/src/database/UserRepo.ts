import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";

import {UserWithRoles} from "../util/interfaces.js";
import Snowflakes from "../util/snowflakes.js";
import {UserRoles} from "../util/enums.js";

export interface IUserRepo {
    findUserById(id: string): Promise<UserWithRoles | null>;
    findUserByEmail(email: string): Promise<UserWithRoles | null>;
    createUser(email: string, password: string): Promise<UserWithRoles | null>;
}

export default class UserRepo implements IUserRepo {
    private readonly db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    public async findUserById(id: string) {
        return await this.db.user
            .findUnique({
                where: {id},
                include: {roles: true},
            })
            .catch(() => null);
    }

    public async findUserByEmail(email: string) {
        return await this.db.user
            .findUnique({
                where: {email},
                include: {roles: true},
            })
            .catch(() => null);
    }

    public async createUser(email: string, password: string) {
        return await this.db.user
            .create({
                data: {
                    id: Snowflakes.nextHexId(),
                    email,
                    password_hash: await bcrypt.hash(password, 10),
                    roles: { connect: { name: UserRoles.USER } },
                },
                include: { roles: true },
            })
            .catch(() => null);
    }
}
