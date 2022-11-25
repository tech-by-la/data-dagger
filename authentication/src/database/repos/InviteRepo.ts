import {PrismaClient, Invite} from "@prisma/client";

export interface IInviteRepo {
    findInvitesByOrg_idAndEmails(organization_id: string, emails: string[]): Promise<Invite[]>;
    upsertInvite(organization_id: string, email: string): Promise<Invite | null>;
}

export default class InviteRepo implements IInviteRepo {
    private readonly db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    public async findInvitesByOrg_idAndEmails(organization_id: string, emails: string[]): Promise<Invite[]> {
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
}
