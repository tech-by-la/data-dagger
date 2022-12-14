import type {RequestHandler} from "@sveltejs/kit";

export const PUT: RequestHandler = () => {

    return new Response();

    // const { user_id, enabled } = query;
    //
    // if ((enabled !== 'true' && enabled !== 'false') || !user_id || typeof user_id !== "string") {
    //     Logger.log('AdminRouter:', "Bad Request enabling/disabling a user");
    //     respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.INVALID_QUERY);
    //     return;
    // }
    //
    // const user = await db.userRepo.findUserById(user_id);
    // if (!user) {
    //     Logger.log("AdminRouter", "Could not find a user to", enabled === "true" ? "enable" : "disable");
    //     respondError(res, StatusCode.NOT_FOUND, HttpErrMsg.RESOURCE_NOT_FOUND);
    //     return;
    // }
    //
    // // An admin cannot enable/disable themselves or other admins (for super admins, demote admins first)
    // if (
    //     req.user.id === user_id ||
    //     user.roles.includes({ name: UserRoles.ADMIN }) ||
    //     user.roles.includes({ name: UserRoles.SUPER_ADMIN })
    // ) {
    //     Logger.log("AdminRouter:", "Error - An admin attempted to", enabled === "true" ? "enable" : "disable", "an admin");
    //     respondError(res, StatusCode.FORBIDDEN, HttpErrMsg.PERMISSION_DENIED);
    //     return;
    // }
    //
    // user.enabled = enabled === 'true';
    // const success = await db.userRepo.updateUser(user).catch();
    // if (!success) {
    //     Logger.error("AdminRouter:", "Internal error - could not update user when querying database");
    //     respondError(res, StatusCode.INTERNAL_SERVER_ERROR, HttpErrMsg.INTERNAL_ERROR);
    //     return;
    // }
    //
    // res.status(StatusCode.NO_CONTENT).send();
}
