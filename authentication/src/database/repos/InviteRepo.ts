import {PrismaClient, Invite} from "@prisma/client";

export interface IInviteRepo {

    findInvitesByEmail(email: string): Promise<Invite[]>;
    findInviteByOrg_idAndEmail(organization_id: string, email: string): Promise<Invite | null>;
    findManyInvitesByOrg_id(organization_id: string): Promise<Invite[]>;
    findManyInvitesByOrg_idAndEmails(organization_id: string, emails: string[]): Promise<Invite[]>;
    upsertInvite(organization_id: string, email: string): Promise<Invite | null>;
    deleteInviteByOrg_idAndEmail(organization_id: string, email: string): Promise<void>;
}

export default class InviteRepo implements IInviteRepo {
    private readonly db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    public async findInvitesByEmail(email: string) {
        return await this.db.invite.findMany({
            where: { email },
        });
    }

    public async findInviteByOrg_idAndEmail(organization_id: string, email: string): Promise<Invite | null> {
        return await this.db.invite.findUnique({
            where: { organization_id_email: { organization_id, email }},
        }).catch(() => null);
    }

    public async findManyInvitesByOrg_id(organization_id: string): Promise<Invite[]> {
        return await this.db.invite.findMany({
            where: { organization_id },
        }).catch();
    }

    public async findManyInvitesByOrg_idAndEmails(organization_id: string, emails: string[]): Promise<Invite[]> {
        return await this.db.invite.findMany({
            where: { organization_id, AND: { email: { in: emails } } },
        }).catch(() => [] as Invite[]);
    }

    public async upsertInvite(organization_id: string, email: string) {
        return await this.db.invite.upsert({
            where: { organization_id_email: { organization_id, email }},
            update: { sent_at: new Date() },
            create: { organization_id, email }
        }).catch(() => null);
    }

    public async deleteInviteByOrg_idAndEmail(organization_id: string, email: string): Promise<void> {
        await this.db.invite.delete({
            where: { organization_id_email: { organization_id, email }},
        });
    }
}
