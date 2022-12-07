import {Router} from 'express';
import {authorizeSuperAdmin, verifyAssignRolesRequestBody} from "../util/middleware.js";
import {respondError} from "../util/helpers.js";
import {HttpErrMsg, StatusCode, UserRoles} from "../util/enums.js";
import db from '../database/DatabaseGateway.js';
import {AssignRolesRequestBody} from "../util/interfaces";

const router = Router();

/*
 * enable/disable user account
 */
router.put('/user-enabled', async (req, res) => {
    const { user_id, enabled } = req.query;

    if ((enabled !== 'true' && enabled !== 'false') || !user_id || typeof user_id !== "string") {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.INVALID_QUERY);
        return;
    }

    const user = await db.userRepo.findUserById(user_id);
    if (!user) {
        respondError(res, StatusCode.NOT_FOUND, HttpErrMsg.RESOURCE_NOT_FOUND);
        return;
    }

    // An admin cannot enable/disable themselves or other admins (for super admins, demote admins first)
    if (
        req.user.id === user_id ||
        user.roles.includes({ name: UserRoles.ADMIN }) ||
        user.roles.includes({ name: UserRoles.SUPER_ADMIN })
    ) {
        respondError(res, StatusCode.FORBIDDEN, HttpErrMsg.PERMISSION_DENIED);
        return;
    }

    user.enabled = enabled === 'true';
    const success = await db.userRepo.updateUser(user).catch();
    if (!success) {
        respondError(res, StatusCode.INTERNAL_SERVER_ERROR, HttpErrMsg.INTERNAL_ERROR);
        return;
    }

    res.status(StatusCode.NO_CONTENT).send();
});

/*
 * enable/disable organization
 */
router.put('/org-enabled', async (req, res) => {
    const { org_id, enabled } = req.query;

    if ((enabled !== 'true' && enabled !== 'false') || !org_id || typeof org_id !== "string") {
        respondError(res, StatusCode.BAD_REQUEST, HttpErrMsg.INVALID_QUERY);
        return;
    }

    const org = await db.orgRepo.findOrgById(org_id);
    if (!org) {
        respondError(res, StatusCode.NOT_FOUND, HttpErrMsg.RESOURCE_NOT_FOUND);
        return;
    }

    org.enabled = enabled === 'true';
    const success = await db.orgRepo.updateOrg(org).catch();
    if (!success) {
        respondError(res, StatusCode.INTERNAL_SERVER_ERROR, HttpErrMsg.INTERNAL_ERROR);
        return;
    }

    res.status(StatusCode.NO_CONTENT).send();
});

/*
 * grant/remove roles to/from a user account
 */
router.put('/user-roles', authorizeSuperAdmin, verifyAssignRolesRequestBody, async (req, res) => {

    const { user_id, role, remove } = req.body as AssignRolesRequestBody;

    // A Super Admin cannot demote themselves from Super Admin to prevent a scenario where there are zero super admins
    if (req.user.id === user_id && role === UserRoles.SUPER_ADMIN) {
        respondError(res, StatusCode.FORBIDDEN, HttpErrMsg.PERMISSION_DENIED);
        return;
    }

    const user = await db.userRepo.findUserById(user_id);
    if (!user) {
        respondError(res, StatusCode.NOT_FOUND, HttpErrMsg.RESOURCE_NOT_FOUND);
        return;
    }

    if (remove && user.roles.find(r => r.name === role)) {
        db.userRepo.removeUserRole(user_id, role).catch();
    } else if (!user.roles.find(r => r.name === role)) {
        db.userRepo.assignUserRole(user_id, role).catch();
    }

    res.status(StatusCode.NO_CONTENT).send();
});

export default router;
