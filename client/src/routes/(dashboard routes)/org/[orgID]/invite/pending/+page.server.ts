import type {PageServerLoad} from "./$types";
import db from '$lib/server/database/DatabaseGateway';

export const load: PageServerLoad = ({params, fetch}) => {

    const fetchInvites = async () => {
        return await db.inviteRepo.findManyInvitesByOrg_id(params.orgID);
    }

    return {
        invites: fetchInvites(),
        org_id: params.orgID
    }
}
