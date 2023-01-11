import type {PageServerLoad} from "./$types";
import type {Actions} from "@sveltejs/kit";
import type {Project} from "$lib/server/util/interfaces";

import {fail, redirect} from "@sveltejs/kit";
import {OrgRoles, ProjectStatus, ProjectType, StatusMessage} from "$lib/server/util/enums";
import db from '$lib/server/database/DatabaseGateway';
import Logger from "$lib/server/util/Logger";

export const load: PageServerLoad = async ({parent}) => {
    await parent();
}

export const actions: Actions = {
    default: async ({request, params, locals}) => {
        const form = await request.formData();

        const organization_id = form.get('organization_id');
        const name = form.get('name');
        const description = form.get('description');
        const type = form.get('type'); // TODO: Define project types (for now all are GeoProject)

        // Verify Request data
        if (
            !organization_id || typeof organization_id !== "string" ||
            !name            || typeof name !== "string" ||
            !description     || typeof description !== "string" ||
            !type            || typeof type !== "string" ||
            !Object.values(ProjectType).includes(type as ProjectType)
        ) {
            return fail(400, { message: StatusMessage.BAD_REQUEST });
        }

        const org = await db.orgRepo.findOrgById(params.orgID || '');

        if (!org) {
            return fail(404, { message: StatusMessage.NOT_FOUND });
        }

        // Find and authorize Organization OWNER or MODERATOR
        if (!org.members.find(
            m => m.user_id === locals.user.sub &&
            (m.org_role_id === OrgRoles.OWNER || m.org_role_id === OrgRoles.MODERATOR))
        ) {
            return fail(401, { message: StatusMessage.UNAUTHORIZED });
        }

        const data = {
            organization_id, name, description, status: ProjectStatus.PENDING, type, members: [],
        } as Project;

        const project = await db.projectRepo?.create(data);

        if (!project) {
            return fail(500, { message: StatusMessage.INTERNAL_SERVER_ERROR });
        }

        Logger.success('User', locals.user.first_name, locals.user.last_name, 'started a new project with name and id', project.name, project.id, 'for organization with name and id', org.name, org.id);

        throw redirect(302, `/project/${project.id}`);
    }
}
