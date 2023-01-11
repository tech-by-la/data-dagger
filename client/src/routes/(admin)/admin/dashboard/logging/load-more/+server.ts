import type {RequestHandler} from "@sveltejs/kit";
import {StatusCode, StatusMessage, UserRoles} from "$lib/server/util/enums";
import {error} from "@sveltejs/kit";
import db from '$lib/server/database/DatabaseGateway';

export const GET: RequestHandler = async ({locals, cookies, url}) => {
    if (!locals.user.roles.includes(UserRoles.SUPER_ADMIN)) {
        throw error(StatusCode.UNAUTHORIZED, { message: StatusMessage.UNAUTHORIZED });
    }

    const page = Number.parseInt(url.searchParams.get('page') || '');
    if (!page || isNaN(page)) {
        throw error(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST});
    }

    const type = cookies.get('log-type') || 'all';
    const logs = await db.logRepo?.getLogs(type, 100, locals.user.sub, page);

    return new Response(JSON.stringify(logs));
}
