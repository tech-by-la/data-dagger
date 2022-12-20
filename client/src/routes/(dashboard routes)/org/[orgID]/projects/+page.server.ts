import type {PageServerLoad} from "./$types";
import db from '$lib/server/database/DatabaseGateway';

export const load: PageServerLoad = ({params}) => {

    return {
        projects: db.projectRepo.findAllByOrg_id(params.orgID),
    }
}
