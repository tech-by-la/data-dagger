import type {LayoutServerLoad} from "../../../../.svelte-kit/types/src/routes/$types";
import {redirect} from "@sveltejs/kit";

export const load: LayoutServerLoad = ({ locals }) => {

    const user = locals.user;
    if (!user || (!user.roles.includes("ADMIN") && !user.roles.includes("SUPER_ADMIN"))) {
        // TODO: route to '/'
        throw redirect(302, "/");
    }
}
