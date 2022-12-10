import type {PageServerLoad} from "./$types";
import {PUBLIC_API_URL} from "$env/static/public";

export const load: PageServerLoad = ({fetch}) => {

    const getUsers = async () => {
        return await fetch(PUBLIC_API_URL + '/auth/users')
            .then(res => res.json())
            .then(data => data.users)
            .catch(() => []);
    }

    const getOrganizations = async () => {
        // return await fetch(PUBLIC_API_URL + '/auth/orgs')
        //     .then(res => res.json())
        //     .then(data => data.organizations)
        //     .catch(() => [1,2,3,4]);
        return [1,2,3];
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
