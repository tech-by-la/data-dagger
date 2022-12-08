import type {PageServerLoad} from "./$types";
import {PUBLIC_API_URL} from "$env/static/public";
import {error} from "@sveltejs/kit";

export const load: PageServerLoad = ({params, fetch}) => {

    const fetchInvites = async () => {
        const response = await fetch(PUBLIC_API_URL + `/auth/invite/${params.orgID}`);
        const data = await response.json().catch();
        if (!response.ok) throw error(response.status);
        return await data;
    }

    return {
        invites: fetchInvites(),
        org_id: params.orgID
    }
}
