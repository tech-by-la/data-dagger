import type {PageServerLoad} from "./$types";
import {PUBLIC_API_URL} from "$env/static/public";
import {error} from "@sveltejs/kit";

export const load: PageServerLoad = ({params, fetch}) => {

    const fetchProjects = async () => {
        const response = await fetch(PUBLIC_API_URL + `/projects/org/${params.orgID}`);
        if (!response.ok) throw error(response.status);
        const data = await response.json();
        return data.data;
    }

    return {
        projects: fetchProjects(),
    }
}
