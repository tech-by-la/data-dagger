import type {PageServerLoad} from "./$types";
import db from '$lib/server/database/DatabaseGateway';
import type {Actions} from "@sveltejs/kit";
import Logger from "$lib/server/util/Logger";
import {UserRoles} from "$lib/server/util/enums";

export const load: PageServerLoad = async ({parent, cookies, locals}) => {
    await parent();

    const type = cookies.get('log-type') || 'all';

    return {
        logs: db.logRepo?.getLogs(type, 100, locals.user.sub),
        total: db.logRepo?.count(type),
        type,
    }
}

export const actions: Actions = {
    apply: async ({request, cookies}) => {
        const form = await request.formData();
        let type = form.get('type');

        if (!type || typeof type !== "string") type = 'all';

        cookies.set('log-type', type, { path: '/admin', httpOnly: true, secure: false, });
    },

    clear: async ({locals, cookies}) => {
        if (!locals.user.roles.includes(UserRoles.SUPER_ADMIN))
            return;

        const type = cookies.get('log-type') || 'all';

        await db.logRepo?.clearLogs(type);
        Logger.admin(locals.user.first_name, locals.user.last_name, "cleared all", type === 'all' ? '' : type, "logs");
    }
}
