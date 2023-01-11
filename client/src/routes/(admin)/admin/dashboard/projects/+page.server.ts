import type {PageServerLoad} from "./$types";
import {type Actions, fail} from "@sveltejs/kit";

import {StatusCode, StatusMessage, UserRoles} from "$lib/server/util/enums";
import db from '$lib/server/database/DatabaseGateway';
import Logger from "$lib/server/util/Logger";

export const load: PageServerLoad = async ({parent}) => {
    await parent();

    const fetchProjects = async () => {
        const projects = await db.projectRepo?.all();
        const org_ids = projects?.map(p => p.organization_id as string);
        const orgs = await db.orgRepo.findManyOrgsByIds(org_ids || []);
        return projects?.map(p => {
            const project = {...p} as any;
            const name = orgs.find(o => o.id === p.organization_id)?.name;
            if (name) project.organization_name = name;
            return project;
        });
    }

    return {
        projects: fetchProjects(),
    }
}

export const actions: Actions = {
    default: async ({request, locals}) => {
        const form = await request.formData();
        const enabled = form.get('enabled');
        const project_id = form.get('project_id');

        const admin = locals.user;

        // Not ADMIN? DENIED!
        if (!admin.roles.find((r: string) => r === UserRoles.SUPER_ADMIN || r === UserRoles.ADMIN)) {
            Logger.error('Admin:', "Unauthorized attempt to change project status");
            return fail(StatusCode.UNAUTHORIZED, { message: StatusMessage.UNAUTHORIZED });
        }

        if ((enabled !== 'true' && enabled !== 'false') || !project_id || typeof project_id !== "string") {
            Logger.error('Admin:', "Bad Request enabling/disabling a project");
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }

        const project = await db.projectRepo?.findById(project_id);
        if (!project) {
            Logger.error("Admin:", "Could not find a project to", enabled === "true" ? "enable" : "disable");
            return fail(StatusCode.NOT_FOUND, { message: StatusMessage.NOT_FOUND });
        }

        project.enabled = enabled === 'true';
        const success = await db.projectRepo?.update(project);
        if (!success) {
            Logger.error("Admin:", "Internal error - could not update project when querying database");
            return fail(StatusCode.INTERNAL_SERVER_ERROR, { message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
        Logger.admin(locals.user.first_name, locals.user.last_name, enabled === "true" ? "enabled" : "disabled", "project with name", project.name, "and id", project.id);
    }
}
