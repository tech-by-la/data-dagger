import {Organization, PrismaClient} from "@prisma/client";
import Snowflakes from "../../util/snowflakes.js";
import {OrgRoles} from "../../util/enums.js";

export interface IOrgRepo {
    findOrgByName(name: string): Promise<Organization | null>;
    createOrg(creator_id: string, name: string, contact_email: string, contact_phone?: string): Promise<Organization | null>;
}

export default class OrgRepo implements IOrgRepo {
    private readonly db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    public async findOrgByName(name: string) {
        return await this.db.organization.findUnique({
            where: { name }
        });
    }

    // Creates a new organization and grants the user role of Owner
    public async createOrg(creator_id: string, name: string, contact_email: string, contact_phone?: string): Promise<Organization | null> {
        return await this.db.organization.create({
            data: {
                id: Snowflakes.nextHexId(),
                name,
                contact_email,
                contact_phone: contact_phone ? contact_phone : null,
                members: { create: {
                    user: { connect: { id: creator_id } },
                    org_role: { connect: { name: OrgRoles.OWNER } }
                } },
            },
        }).catch((err: any) => {
            console.error(err);
            return null;
        });
    }
}
