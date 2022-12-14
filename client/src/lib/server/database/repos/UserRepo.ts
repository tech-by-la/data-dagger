import type {PrismaClient, UserRole} from "@prisma/client";
import type {UserInfo} from "$lib/server/util/interfaces";
import bcrypt from "bcrypt";

import Snowflakes from "$lib/server/util/snowflakes";
import {UserRoles} from "$lib/server/util/enums";
import {excludeKey, excludeKeys} from "$lib/server/util/helpers";

export interface IUserRepo {

    getAll(): Promise<UserInfo[]>;
    findUserById(id: string): Promise<UserInfo | null>;
    findManyUsersById(ids: string[]): Promise<UserInfo[]>;
    findUserByEmail(email: string): Promise<UserInfo | null>;
    findManyUsersByEmail(emails: string[]): Promise<UserInfo[]>;
    createUser(email: string, password: string, first_name?: string, last_name?: string): Promise<UserInfo | null>;
    updateUser(user: UserInfo): Promise<UserInfo | null>;
    assignUserRole(user_id: string, role: UserRole["name"]): Promise<UserInfo | null>;
    removeUserRole(user_id: string, role: UserRole["name"]): Promise<UserInfo | null>;
}

export default class UserRepo implements IUserRepo {
    private readonly db: PrismaClient;
    constructor(db: PrismaClient) {
        this.db = db;
    }

    public async getAll(): Promise<UserInfo[]> {
        return await this.db.user.findMany({
            include: {roles: true, orgs: true},
        })
            .then(users => excludeKeys(users, ['password_hash']))
            .catch(() => []);
    }

    public async findUserById(id: string) {
        return await this.db.user
            .findUnique({
                where: {id},
                include: {roles: true, orgs: true},
            })
            .then(user => user ? excludeKey(user, ['password_hash']) : null)
            .catch(() => null);
    }
    public async findManyUsersById(ids: string[]) {
        return await this.db.user
            .findMany({
                where: {id: { in: ids }},
                include: {roles: true, orgs: true},
            })
            .then(users => excludeKeys(users, ['password_hash']))
            .catch(() => []);
    }

    /*
     * IMPORTANT:
     * Never include the result of this function in a request response without removing the password_hash first!
     */
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
        })
            .then(users => excludeKeys(users, ['password_hash']))
            .catch(() => []);
    }

    public async createUser(email: string, password: string, first_name?: string, last_name?: string) {
        return await this.db.user
            .create({
                data: {
                    id: Snowflakes.nextHexId(),
                    email,
                    first_name: first_name || null,
                    last_name: last_name || null,
                    password_hash: await bcrypt.hash(password, 10),
                    roles: { connect: { name: UserRoles.USER } },
                },
                include: { roles: true, orgs: true },
            })
            .then(user => excludeKey(user, ['password_hash']))
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
        })
            .then(user => excludeKey(user, ['password_hash']))
            .catch();
    }

    public async assignUserRole(user_id: string, role: UserRole["name"]) {
        return this.db.user.update({
            where: { id: user_id },
            data: {
                roles: { connect: { name: role }}
            }
        })
            .then(user => excludeKey(user, ['password_hash']))
            .catch(() => null);
    }

    public async removeUserRole(user_id: string, role: UserRole["name"]) {
        return this.db.user.update({
            where: { id: user_id },
            data: {
                roles: { disconnect: { name: role }}
            }
        })
            .then(user => excludeKey(user, ['password_hash']))
            .catch(() => null);
    }
}
