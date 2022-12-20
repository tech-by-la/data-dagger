import type {Project} from "$lib/server/util/interfaces";
import {type Actions, fail} from "@sveltejs/kit";

import {StatusCode, StatusMessage} from "$lib/server/util/enums";
import db from "$lib/server/database/DatabaseGateway";

export const actions: Actions = {
    default: async ({request, locals}) => {
        const form = await request.formData();
        const project_id = form.get('project_id');

        if (!project_id || typeof project_id !== "string") {
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }

        // find and confirm project existence
        const project: Project | undefined = await db.projectRepo.findEnabledById(project_id);
        const org = await db.orgRepo.findOrgById(project?.organization_id);
        if (!project || !org) {
            return fail(StatusCode.NOT_FOUND, { message: StatusMessage.NOT_FOUND });
        }

        // confirm user is in the organization
        if (!org?.members.find(m => m.user_id === locals.user.sub)) {
            return fail(StatusCode.UNAUTHORIZED, { message: StatusMessage.UNAUTHORIZED });
        }

        let result;
        const isMember = project.members?.includes(locals.user.sub);
        if (isMember) {
            await db.projectRepo.leave(project_id, locals.user.sub);
        } else {
            await db.projectRepo.join(project_id, locals.user.sub);
        }
    }
}
