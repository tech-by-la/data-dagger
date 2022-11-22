import {PrismaClient} from "@prisma/client";
import bcrypt from 'bcrypt';

import RefreshTokenRepo from "./repos/RefreshTokenRepo.js";
import {ErrMsg, UserRoles} from "../util/enums.js";
import Snowflakes from "../util/snowflakes.js";
import UserRepo from "./repos/UserRepo.js";

export interface IDatabaseGateway {
    userRepo: UserRepo;
    refreshTokenRepo: RefreshTokenRepo;
}

class DatabaseGateway implements IDatabaseGateway {
    private readonly db = new PrismaClient();

    public userRepo = new UserRepo(this.db);
    public refreshTokenRepo = new RefreshTokenRepo(this.db);

    /*
	 * Populate database with default data if it doesn't exist
	 * This will only run once per server reboot since it is called in the constructor and this is a singleton class
	 */
    public async initDb() {
        if (!process.env.DEFAULT_ADMIN_PASS) {
            throw new Error(ErrMsg.MISSING_ENV + " DEFAULT_ADMIN_PASS");
        }

        await this.db.userRole.upsert({
            where: { name: UserRoles.SUPER_ADMIN },
            create: { name: UserRoles.SUPER_ADMIN },
            update: {},
        });
        await this.db.userRole.upsert({
            where: { name: UserRoles.ADMIN },
            create: { name: UserRoles.ADMIN },
            update: {},
        });

        await this.db.userRole.upsert({
            where: { name: UserRoles.USER },
            create: { name: UserRoles.USER },
            update: {},
        });

        await this.db.user.upsert({
            where: { email: "admin" },
            update: {},
            create: {
                id: Snowflakes.nextHexId(),
                email: "admin",
                password_hash: await bcrypt.hash(process.env.DEFAULT_ADMIN_PASS, 12),
                roles: {
                    connect: [{ name: UserRoles.ADMIN }],
                },
            },
        });
    }
}

export default new DatabaseGateway();
