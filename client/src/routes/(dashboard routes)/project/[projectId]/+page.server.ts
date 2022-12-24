import type {PageServerLoad} from "./$types";
import {type Actions, error, fail} from "@sveltejs/kit";
import type {Project} from "$lib/server/util/interfaces";

import {GeoServerProps, OrgRoles, StatusCode, StatusMessage} from "$lib/server/util/enums";
import db from "$lib/server/database/DatabaseGateway";
import WFS from "$lib/server/projects/WFS";
import Demo from "$lib/server/projects/Demo";
import {GEOSERVER_HOST} from "$env/static/private";
import Logger from "$lib/server/util/Logger";

export const load: PageServerLoad = async ({parent, params, fetch}) => {
    await parent();

    const fetchProjectData = async () => {
        const URL = `${GEOSERVER_HOST}/datadagger/ows?service=WFS&version=2.0.0&request=GetFeature&outputFormat=json
            &typeNames=${GeoServerProps.Layer}
            &Filter=<Filter><PropertyIsEqualTo><PropertyName>project_id</PropertyName><Literal>${params.projectId}</Literal></PropertyIsEqualTo></Filter>
        `;

        const response = await fetch(URL);

        if (!response.ok) {
            Logger.error(await response.text().catch());
            return [];
            // throw error(StatusCode.INTERNAL_SERVER_ERROR, {message: StatusMessage.INTERNAL_SERVER_ERROR});
        }

        const data = await response.json();
        return data?.features;
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
        const response = await WFS.insertProjectTiles(features, project.id);
        if (!response) {
            // this only happens if the geojson is formatted badly
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }

        const data = await response.text();
        console.log(data);
    },

    // Dev action
    delete: async ({request}) => {
        const form = await request.formData();
        const project_id = form.get('project_id');

        if (!project_id || typeof project_id !== "string") {
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }

        await WFS.deleteProjectData(project_id);
    }
}
