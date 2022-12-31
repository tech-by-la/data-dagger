import type {RequestHandler} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import {StatusCode, StatusMessage} from "$lib/server/util/enums";
import db from '$lib/server/database/DatabaseGateway';

/*
 * This endpoint is only meant to be called from the project workzone on beforeNavigate.
 */
export const GET: RequestHandler = ({locals, params}) => {

    if (!locals.user) {
        throw error(StatusCode.UNAUTHORIZED, { message: StatusMessage.UNAUTHORIZED });
    }

    db.fidRepo.unlock(params.fid || '', locals.user?.sub || '');

    return new Response();
}
