import type {PageLoad} from "./$types";

export const load: PageLoad = ({fetch}) => {
    const fetchUsers = async () => {
        const HOST = 'http://localhost:3000'
        return await fetch(HOST + '/api/auth/users')
            .then(res => res.json())
            .then(data => data.users)
            .catch(() => []);
    }

    return {
        users: fetchUsers(),
    }
}


