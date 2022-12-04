import type {ServerLoad} from "@sveltejs/kit";
import {redirect} from "@sveltejs/kit";

export const load: ServerLoad = ({ locals }) => {

    const user = locals.user;
    if (!user || (!user.roles.includes("ADMIN") && !user.roles.includes("SUPER_ADMIN"))) {
        // TODO: route to '/'
        throw redirect(302, "/admin/dashboard");
    } else {
        throw redirect(302, "/admin/dashboard");
    }
}
