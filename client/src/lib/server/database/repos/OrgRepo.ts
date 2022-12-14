import type {Organization, OrgUser, PrismaClient} from "@prisma/client";
import Snowflakes from "../../util/snowflakes.js";
import {OrgRoles} from "../../util/enums.js";

export interface IOrgRepo {
    getAll(): Promise<Organization[]>;
    findOrgById(id: string): Promise<Organization | null>;
    findOrgByName(name: string): Promise<Organization | null>;
    findManyOrgsByIds(ids: string[]): Promise<Organization[]>;
    findManyOrgsByUser_id(id: string): Promise<Organization[]>;
    createOrg(creator_id: string, name: string, contact_email: string, contact_phone?: string): Promise<Organization | null>;
    updateOrg(org: Organization): Promise<Organization | null>;
    upsertOrgUser(organization_id: string, user_id: string): Promise<OrgUser | null>;
}

export default class OrgRepo implements IOrgRepo {
    private readonly db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    public async getAll() {
        return await this.db.organization.findMany();
    }

    public async findOrgById(id: string) {
        return await this.db.organization.findUnique({
            where: { id },
            include: { members: { select: {
                user_id: true,
                org_role_id: true,
                user: { select: {
                    email: true,
                    first_name: true,
                    last_name: true,
                }
            }
        }}}});
    }

    public async findOrgByName(name: string) {
        return await this.db.organization.findUnique({
            where: { name }
        });
    }

    public async findManyOrgsByIds(ids: string[]) {
        return await this.db.organization.findMany({
            where: { id: { in: ids } }
        });
    }

    public async findManyOrgsByUser_id(id: string) {
        return await this.db.organization.findMany({
            where: { members: { some: { user_id: id } } }
        })
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
                    user: { connect: { id: creator_id }},
                    org_role: { connect: { name: OrgRoles.OWNER }}
                } },
            },
        }).catch(() => null);
    }

    public async updateOrg(org: Organization): Promise<Organization | null> {
        return await this.db.organization.update({
            where: { id: org.id },
            data: {
                name: org.name,
                contact_email: org.contact_email,
                contact_phone: org.contact_phone,
                enabled: org.enabled,
            }
        }).catch(() => null);
    }

    public async upsertOrgUser(organization_id: string, user_id: string): Promise<OrgUser | null> {
        return await this.db.orgUser.upsert({
            where: { user_id_organization_id: { organization_id, user_id }},
            update: {},
            create: {
                user: { connect: { id: user_id }},
                organization: { connect: { id: organization_id }},
                org_role: { connect: { name: OrgRoles.MEMBER }}
            }
        }).catch(() => null);
    }
}
