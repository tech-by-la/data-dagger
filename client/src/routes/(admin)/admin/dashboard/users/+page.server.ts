import type {Actions} from "@sveltejs/kit";
import {PUBLIC_API_URL} from "$env/static/public";
import {invalid} from "@sveltejs/kit";

export const actions: Actions = {
    enable: async ({request, fetch}) => {
        const data = await request.formData();
        const user_id = data.get('user_id');
        const enabled = data.get('enabled');
        const response = await fetch(PUBLIC_API_URL + '/auth/admin/user-enabled' + `?user_id=${user_id}&enabled=${enabled}`, {
            method: "PUT",
        });

        console.log(response.status, response.statusText)

        if (response.status !== 204) {
            return invalid(response.status, { error: response.statusText });
        }

        return {}
    }
}
