import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";

import {UserInfo} from "../../util/interfaces.js";
import Snowflakes from "../../util/snowflakes.js";
import {UserRoles} from "../../util/enums.js";

export interface IUserRepo {
    findUserById(id: string): Promise<UserInfo | null>;
    findUserByEmail(email: string): Promise<UserInfo | null>;
    findManyUsersByEmail(emails: string[]): Promise<UserInfo[] | null>;
    createUser(email: string, password: string): Promise<UserInfo | null>;
    updateUser(user: UserInfo): Promise<UserInfo | null>;
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
                include: {roles: true, orgs: true},
            })
            .catch(() => null);
    }

    public async findUserByEmail(email: string) {
        return await this.db.user
            .findUnique({
                where: {email},
                include: {roles: true, orgs: true},
            })
            .catch(() => null);
    }

    public async findManyUsersByEmail(emails: string[]) {
        return await this.db.user.findMany({
            where: { email: { in: emails } },
            include: {roles: true, orgs: true},
        });
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

    public async updateUser(user: UserInfo) {
        return await this.db.user.update({
            where: { id: user.id },
            data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                password_hash: user.password_hash,
                enabled: user.enabled,
            },
        });
    }
}
