import type {PageServerLoad} from "./$types";
import db from '$lib/server/database/DatabaseGateway';

export const load: PageServerLoad = () => {

    const getUsers = async () => {
        return await db.userRepo.getAll();
    }

    const getOrganizations = async () => {
        return await db.orgRepo.getAll();
    }
    const getProjects = async () => {
        // return await fetch(PUBLIC_API_URL + '/api/projects')
        //     .then(res => res.json())
        //     .then(data => data.projects)
        //     .catch(() => [1,2]);
        return [1,2];
    }

    return {
        allUsers: getUsers(),
        allOrganizations: getOrganizations(),
        allProjects: getProjects(),
    }
}
