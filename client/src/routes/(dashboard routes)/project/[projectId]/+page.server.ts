import type {PageServerLoad} from "./$types";
import {type Actions, error, fail} from "@sveltejs/kit";
import type {Project} from "$lib/server/util/interfaces";

import {OrgRoles, ProjectStatus, StatusCode, StatusMessage} from "$lib/server/util/enums";
import db from "$lib/server/database/DatabaseGateway";
import Demo from "$lib/server/geoserver/Demo";
import Logger from "$lib/server/util/Logger";
import GeoServer from "$lib/server/geoserver/GeoServer";

export const load: PageServerLoad = async ({parent, params}) => {
    const { project } = await parent();

    const fetchProjectData = async () => {
        const response = await GeoServer.WFS.fetchFeaturesByProject(params.projectId);

        if (!response.ok) {
            Logger.error(await response.text().catch());
            // return [];
            throw error(StatusCode.INTERNAL_SERVER_ERROR, {message: StatusMessage.INTERNAL_SERVER_ERROR});
        }

        const data = await response.json();

        return data?.features || [];
    }

    return {
        features: fetchProjectData(),
    }
}

export const actions: Actions = {
    joinOrLeave: async ({request, locals}) => {
        const form = await request.formData();
        const project_id = form.get('project_id');

        if (!project_id || typeof project_id !== "string") {
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }

        // authorize
        const project: Project | undefined = await db.projectRepo.findEnabledById(project_id);
        const org = await db.orgRepo.findOrgById(project?.organization_id || '');
        const member = org?.members.find(m => m.user_id === locals.user.sub);
        if (!project || !member) {
            return fail(StatusCode.UNAUTHORIZED, { message: StatusMessage.UNAUTHORIZED });
        }

        const isMember = project.members?.includes(locals.user.sub);
        if (isMember) {
            await db.projectRepo.leave(project_id, locals.user.sub);
        } else {
            await db.projectRepo.join(project_id, locals.user.sub);
        }
    },

    startDemo: async ({request, locals}) => {
        const form = await request.formData();
        const project_id = form.get('project_id');
        const size = form.get('size');
        // check request data
        if (
            !project_id || typeof project_id !== "string" ||
            !size || typeof size !== "string" || isNaN(Number.parseInt(size))
        ) {
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }

        // authorize user
        const project = await db.projectRepo.findEnabledById(project_id);
        const org = await db.orgRepo.findOrgById(project?.organization_id || '');
        const mod = org?.members.find(m =>
            m.user_id === locals.user.sub &&
            (m.org_role_id === OrgRoles.OWNER || m.org_role_id === OrgRoles.MODERATOR)
        );

        if (!project || !mod) {
            return fail(StatusCode.FORBIDDEN, { message: StatusMessage.FORBIDDEN });
        }

        const features = Demo.generateDemo(Number.parseInt(size));
        const response = await GeoServer.WFS.insertFeatures(features, project_id);
        if (!response) {
            // this only happens if the geojson is formatted badly
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }

        let inserted = 0;
        if (response.ok) {
            const data = await response.text();
            const query = `<wfs:totalInserted>`
            inserted = Number.parseInt(data.slice(data.indexOf(query) + query.length).split('<')[0]);
        } else {
            return fail(StatusCode.INTERNAL_SERVER_ERROR, { message: StatusMessage.INTERNAL_SERVER_ERROR });
        }

        if (!isNaN(inserted) && inserted > 0) {
            project.status = ProjectStatus.STARTED;
            await db.projectRepo.update(project);
        }
    },

    // Dev action
    delete: async ({request}) => {
        const form = await request.formData();
        const project_id = form.get('project_id');

        if (!project_id || typeof project_id !== "string") {
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }

        const project = await db.projectRepo.findById(project_id);
        if (!project) {
            return fail(StatusCode.NOT_FOUND, { message: StatusMessage.NOT_FOUND });
        }

        project.status = ProjectStatus.PENDING;
        await GeoServer.WFS.deleteProjectData(project_id);
        await db.projectRepo.update(project);
    }
}
