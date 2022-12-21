import type {PageServerLoad} from "./$types";
import type {Actions} from "@sveltejs/kit";
import type {Project} from "$lib/server/util/interfaces";

import {fail, redirect} from "@sveltejs/kit";
import {OrgRoles, StatusMessage} from "$lib/server/util/enums";
import db from '$lib/server/database/DatabaseGateway';

export const load: PageServerLoad = async ({parent}) => {
    await parent();
}

export const actions: Actions = {
    default: async ({request, params, locals}) => {
        const form = await request.formData();

        const organization_id = form.get('organization_id');
        const name = form.get('name');
        const status = form.get('status'); // TODO: Define project status (for now all are PENDING)
        const description = form.get('description');
        const start_date = form.get('start_date');
        const end_date = form.get('end_date');
        const type = form.get('type'); // TODO: Define project types (for now all are GeoProject)

        // Verify Request data
        if (
            !organization_id || typeof organization_id !== "string" ||
            !name            || typeof name !== "string" ||
            !description     || typeof description !== "string" ||
            !status          || typeof status !== "string" ||
            !type            || typeof type !== "string" ||
            (start_date && typeof start_date !== "string") ||
            (end_date && typeof end_date !== "string") ||
            (start_date && isNaN(Number.parseInt(start_date))) || // not a number
            (end_date && isNaN(Number.parseInt(end_date))) || // not a number
            (start_date && !end_date) || (end_date && start_date) // either start_date or end_date is present without the other
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
            organization_id, name, description, status, type, members: [],
            start_date: start_date ? Number.parseInt(start_date) : null,
            end_date: end_date ? Number.parseInt(end_date) : null,
        } as Project;

        const project = await db.projectRepo.create(data);

        if (!project) {
            return fail(500, { message: StatusMessage.INTERNAL_SERVER_ERROR });
        }

        throw redirect(302, `/project/${project.id}`);
    }
}
