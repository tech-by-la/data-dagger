import type {PageServerLoad} from "./$types";
import {error} from "@sveltejs/kit";
import {StatusCode, StatusMessage} from "$lib/server/util/enums";

export const load: PageServerLoad = () => {
    throw error(StatusCode.NOT_FOUND, { message: StatusMessage.NOT_FOUND })
}
