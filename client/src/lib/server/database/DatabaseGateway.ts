import {PrismaClient} from "@prisma/client";
import bcrypt from 'bcrypt';
import mongoose, {type Connection} from 'mongoose';

import RefreshTokenRepo from "./repos/RefreshTokenRepo.js";
import {ErrMsg, OrgRoles, UserRoles} from "../util/enums.js";
import Snowflakes from "../util/snowflakes.js";
import UserRepo from "./repos/UserRepo.js";
import OrgRepo from "./repos/OrgRepo.js";
import InviteRepo from "./repos/InviteRepo.js";
import ProjectsRepo from "$lib/server/database/repos/ProjectsRepo";
import Logger from "$lib/server/util/Logger";
import FidRepo from "$lib/server/database/repos/FidRepo";

export interface IDatabaseGateway {
    userRepo: UserRepo;
    refreshTokenRepo: RefreshTokenRepo;
    orgRepo: OrgRepo;
    inviteRepo: InviteRepo;
    projectRepo: ProjectsRepo | null;
    fidRepo: FidRepo | null;
}

class DatabaseGateway implements IDatabaseGateway {
    private readonly db = new PrismaClient();
    private projDb: Connection | null = null;

    public readonly userRepo = new UserRepo(this.db);
    public readonly refreshTokenRepo = new RefreshTokenRepo(this.db);
    public readonly orgRepo = new OrgRepo(this.db);
    public readonly inviteRepo = new InviteRepo(this.db);
    public projectRepo: ProjectsRepo | null = null;
    public fidRepo: FidRepo | null = null;

    constructor() {
        Logger.log('Initializing Databases');



    }

    /*
	 * Populate prisma database with default data if it doesn't exist
	 * This will only run once per server reboot since it is called in the constructor and this is a singleton class
	 */
    public async initDb() {

        if (!process.env.DEFAULT_ADMIN_PASS) {
            throw new Error(ErrMsg.MISSING_ENV + " DEFAULT_ADMIN_PASS");
        }

        // Mongoose (mongodb)
        const url = process.env.PR_DATABASE_URL;
        if (!url) throw Error('DATABASE_URL is missing in environment');
        mongoose.createConnection(url, (err, result) => {
            if (err) {
                Logger.error('Could not initialize Projects Database')
                return;
            }
            this.projDb = result;
            this.projectRepo = new ProjectsRepo(this.projDb);
            this.fidRepo = new FidRepo(this.projDb);
            Logger.log('Projects Database Initialized');
        });

        // Prisma (mysql)
        try {
            // Upsert Super Admin role
            await this.db.userRole.upsert({
                where: {name: UserRoles.SUPER_ADMIN},
                create: {name: UserRoles.SUPER_ADMIN},
                update: {},
            });

            // Upsert Admin role
            await this.db.userRole.upsert({
                where: {name: UserRoles.ADMIN},
                create: {name: UserRoles.ADMIN},
                update: {},
            });

            // Upsert User role
            await this.db.userRole.upsert({
                where: {name: UserRoles.USER},
                create: {name: UserRoles.USER},
                update: {},
            });

            // Upsert Owner role
            await this.db.orgRole.upsert({
                where: {name: OrgRoles.OWNER},
                create: {name: OrgRoles.OWNER},
                update: {}
            });

            // Upsert Moderator role
            await this.db.orgRole.upsert({
                where: {name: OrgRoles.MODERATOR},
                create: {name: OrgRoles.MODERATOR},
                update: {}
            });

            // Upsert Member role
            await this.db.orgRole.upsert({
                where: {name: OrgRoles.MEMBER},
                create: {name: OrgRoles.MEMBER},
                update: {}
            });

            // Upsert default admin account
            await this.db.user.upsert({
                where: {email: "admin@datadagger.com"},
                update: {},
                create: {
                    id: Snowflakes.nextHexId(),
                    email: "admin@datadagger.com",
                    password_hash: await bcrypt.hash(process.env.DEFAULT_ADMIN_PASS, 12),
                    roles: {
                        connect: [{name: UserRoles.SUPER_ADMIN}],
                    },
                },
            });
            Logger.log('Authentication Database Initialized');
        } catch (e) {
            Logger.log('Could not initialize Authentication Database');
        }
    }
}

export default new DatabaseGateway();
