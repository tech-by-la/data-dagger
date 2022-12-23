import type {LayoutServerLoad} from "./$types";
import {error} from "@sveltejs/kit";

import db from '$lib/server/database/DatabaseGateway';
import {StatusCode, StatusMessage} from "$lib/server/util/enums";
import type {Project} from "$lib/server/util/interfaces";

export const load: LayoutServerLoad = async ({locals, parent, params}) => {
    await parent();

    const fetchProject = async () => {
        const project: Project | undefined = await db.projectRepo.findEnabledById(params.projectId);
        if (!project) {
            throw error(StatusCode.NOT_FOUND, { message: StatusMessage.NOT_FOUND });
        }

        const org = await db.orgRepo.findOrgById(project.organization_id);
        if (!org?.members.find(m => m.user_id === locals.user.sub)) {
            throw error(StatusCode.UNAUTHORIZED, { message: StatusMessage.UNAUTHORIZED });
        }

        // hide other member information client side
        org.members = org.members.filter(m => m.user_id === locals.user.sub);

        return { project, org };
    }

    return fetchProject();
}
