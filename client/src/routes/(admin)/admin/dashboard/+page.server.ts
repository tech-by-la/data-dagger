import type {PageServerLoad} from "./$types";
import db from '$lib/server/database/DatabaseGateway';

export const load: PageServerLoad = async ({parent}) => {
    await parent();

    const getUsers = async () => {
        return await db.userRepo.count();
    }

    const getOrganizations = async () => {
        return await db.orgRepo.count();
    }
    const getProjects = async () => {
        return await db.projectRepo.count();
    }

    return {
        allUsers: getUsers(),
        allOrganizations: getOrganizations(),
        allProjects: getProjects(),
    }
}
