import type {PageLoad} from "./$types";

export const load: PageLoad = ({fetch}) => {

    const getUsers = async () => {
        return await fetch('http://localhost:3000/api/auth/users')
            .then(res => res.json())
            .then(data => data.users)
            .catch(() => []);
    }

    const getOrganizations = async () => {
        // return await fetch('http://localhost:3000/api/auth/orgs')
        //     .then(res => res.json())
        //     .then(data => data.organizations)
        //     .catch(() => [1,2,3,4]);
        return [1,2,3];
    }
    const getProjects = async () => {
        // return await fetch('http://localhost:3000/api/projects')
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
