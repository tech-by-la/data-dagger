import type {PageServerLoad} from "./$types";
import db from '$lib/server/database/DatabaseGateway';

export const load: PageServerLoad = async ({params, parent}) => {
    await parent();

    return {
        projects: db.projectRepo.findAllByOrg_id(params.orgID),
    }
}
