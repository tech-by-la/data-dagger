import type {ServerLoad} from "@sveltejs/kit";
import {redirect} from "@sveltejs/kit";

export const load: ServerLoad = () => {
    throw redirect(302, '/admin/dashboard');
}
