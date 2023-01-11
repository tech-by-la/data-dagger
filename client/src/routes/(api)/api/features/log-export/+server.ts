import type {RequestHandler} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import {StatusCode, StatusMessage} from "$lib/server/util/enums";
import Logger from "$lib/server/util/Logger";

export const GET: RequestHandler = ({locals, url}) => {
    if (!locals.user) {
        throw error(StatusCode.UNAUTHORIZED, { message: StatusMessage.UNAUTHORIZED });
    }

    const project_id = url.searchParams.get('project');
    const comments = url.searchParams.get('comments') === 'true';
    if (!project_id) {
        throw error(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
    }

    Logger.success('User', locals.user.first_name, locals.user.last_name, 'with email', locals.user.email, 'exported the', comments ? 'comment' : 'main', 'feature for project with id', project_id);
    return new Response();
}
