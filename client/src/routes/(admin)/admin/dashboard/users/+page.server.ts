import type {PageLoad} from "./$types";
import {PUBLIC_API_URL} from "$env/static/public";

export const load: PageLoad = ({fetch}) => {
    const fetchUsers = async () => {
        return await fetch(PUBLIC_API_URL + '/auth/users')
            .then(res => res.json())
            .then(data => data.users)
            .catch(() => []);
    }

    return {
        users: fetchUsers(),
    }
}

