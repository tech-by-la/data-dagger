import type {PageServerLoad} from "./$types";
import db from "$lib/server/database/DatabaseGateway";
import type {Actions} from "@sveltejs/kit";
import Logger from "$lib/server/util/Logger";
import {fail} from "@sveltejs/kit";
import {StatusCode, StatusMessage, UserRoles} from "$lib/server/util/enums";

export const load: PageServerLoad = async ({locals, parent}) => {
    await parent();

    const fetchUsers = async () => {
        const users = await db.userRepo.getAll();

        // Filter out admin if logged-in user is not Super Admin
        if (!locals.user.roles.includes(UserRoles.SUPER_ADMIN)) {
            return users.filter(u =>
                !u.roles?.find(r => r.name === UserRoles.ADMIN) &&
                !u.roles?.find(r => r.name === UserRoles.SUPER_ADMIN)
            );
        }
        return users;
    }

    return {
        users: fetchUsers(),
    }
}

export const actions: Actions = {
    setEnabled: async ({request, locals}) => {

        const form = await request.formData();
        const enabled = form.get('enabled');
        const user_id = form.get('user_id');

        const admin = locals.user;

        // Not ADMIN? DENIED!
        if (!admin.roles.find((r: string) => r === UserRoles.SUPER_ADMIN || r === UserRoles.ADMIN)) {
            Logger.log('AdminRouter:', "Unauthorized attempt to change user status");
            return fail(StatusCode.UNAUTHORIZED, { message: StatusMessage.UNAUTHORIZED });
        }

        if ((enabled !== 'true' && enabled !== 'false') || !user_id || typeof user_id !== "string") {
            Logger.log('AdminRouter:', "Bad Request enabling/disabling a user");
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }

        const user = await db.userRepo.findUserById(user_id);
        if (!user) {
            Logger.log("AdminRouter", "Could not find a user to", enabled === "true" ? "enable" : "disable");
            return fail(StatusCode.NOT_FOUND, { message: StatusMessage.NOT_FOUND });
        }

        // An admin cannot enable/disable themselves or other admins (for super admins, demote admins first)
        if (
            user.id === admin.sub ||
            user.roles.includes({ name: UserRoles.ADMIN }) ||
            user.roles.includes({ name: UserRoles.SUPER_ADMIN })
        ) {
            Logger.log("AdminRouter:", "Error - An admin attempted to", enabled === "true" ? "enable" : "disable", "an admin");
            return fail(StatusCode.FORBIDDEN, { message: StatusMessage.FORBIDDEN })
        }

        user.enabled = enabled === 'true';
        const success = await db.userRepo.updateUser(user).catch();
        if (!success) {
            Logger.error("AdminRouter:", "Internal error - could not update user when querying database");
            return fail(StatusCode.INTERNAL_SERVER_ERROR, { message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    },

    setRole: async ({request, locals}) => {
        const form = await  request.formData();

        const user_id = form.get('user_id');
        const role = form.get('role');
        const remove = form.get('remove');

        const admin = locals.user;

        // Not SUPER ADMIN? DENIED!
        if (!admin.roles.includes(UserRoles.SUPER_ADMIN)) {
            return fail(StatusCode.UNAUTHORIZED, { message: StatusMessage.UNAUTHORIZED });
        }

        // Look for bad input
        if (
            !user_id || typeof user_id !== "string" ||
            !role || (role !== UserRoles.USER && role !== UserRoles.ADMIN && role !== UserRoles.SUPER_ADMIN)
        ) {
            Logger.log('AdminRouter:', "Bad Request enabling/disabling a user");
            return fail(400, { message: StatusMessage.BAD_REQUEST });
        }

        // A Super Admin cannot demote themselves from Super Admin to prevent a scenario where there are zero super admins
        if (admin.sub === user_id && role === UserRoles.SUPER_ADMIN) {
            return fail(StatusCode.FORBIDDEN, { message: StatusMessage.FORBIDDEN });
        }

        const user = await db.userRepo.findUserById(user_id);
        if (!user) {
            return fail(StatusCode.NOT_FOUND, { message: StatusMessage.NOT_FOUND });
        }

        if (remove && user.roles.find(r => r.name === role)) {
            await db.userRepo.removeUserRole(user_id, role).catch();
        } else if (!user.roles.find(r => r.name === role)) {
            await db.userRepo.assignUserRole(user_id, role).catch();
        }
    }
}


