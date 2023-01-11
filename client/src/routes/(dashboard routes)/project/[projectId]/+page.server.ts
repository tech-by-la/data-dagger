import type {PageServerLoad} from "./$types";
import {type Actions, error, fail} from "@sveltejs/kit";
import type {Project} from "$lib/server/util/interfaces";

import {GeoServerProps, OrgRoles, ProjectStatus, StatusCode, StatusMessage, UserRoles} from "$lib/server/util/enums";
import GeoServer from "$lib/server/geoserver/GeoServer";
import db from "$lib/server/database/DatabaseGateway";
import Demo from "$lib/server/geoserver/Demo";
import Logger from "$lib/server/util/Logger";

export const load: PageServerLoad = async ({parent, params}) => {
    await parent();

    // TODO: remove any data that isn't necessary for non-mods/owners.
    const fetchFeatures = async () => {

        // fetch feature from GeoServer over WFS
        const response = await GeoServer.WFS.fetchFeaturesByProject(params.projectId);
        if (!response.ok) {
            Logger.error(await response.text().catch());
            throw error(StatusCode.INTERNAL_SERVER_ERROR, {message: StatusMessage.INTERNAL_SERVER_ERROR});
        }

        const data = await response.json();

        // remove unnecessary data.
        delete data.numberMatched;
        delete data.numberReturned;
        for (const feature of data.features) {
            delete feature.id;
            delete feature.geometry_name;
            delete feature.properties.project_id;
        }

        // project data
        const project = await db.projectRepo?.findEnabledById(params.projectId);
        if (!project) {
            throw error(StatusCode.NOT_FOUND, { message: StatusMessage.NOT_FOUND });
        }

        // Update project status
        // This is the best place to do this because all events that would alter the status redirect here.
        // This way we avoid extra WFS calls (WFS is slow)
        project.status = data.features.length === 0
            ? ProjectStatus.PENDING
            : data.features.filter((f: {properties: {status: string}, features: []}) =>
                f.properties.status !== 'ready').length === data.features.length
            ? ProjectStatus.FINISHED
            : ProjectStatus.STARTED;

        await db.projectRepo?.update(project);

        data.name = project.name.replaceAll(/[^\w ]/g, '').replaceAll(' ', '').toLowerCase();
        data.crs = { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::3857" } }; // TODO: get this with the WFS call if possible?

        return data;
    }

    // TODO: consider if this fetch is needed for non-mod/owners and if it is, only fetch a count.
    const fetchComments = async () => {
        const response = await GeoServer.WFS.fetchCommentsByProject(params.projectId);
        if (!response.ok) {
            Logger.error(await response.text().catch());
            throw error(StatusCode.INTERNAL_SERVER_ERROR, {message: StatusMessage.INTERNAL_SERVER_ERROR});
        }

        const data = await response.json();

        // remove unnecessary data.
        delete data.numberMatched;
        delete data.numberReturned;
        for (const feature of data.features) {
            delete feature.id;
            delete feature.geometry_name;
            delete feature.properties.project_id;
        }

        return data
    }

    return {
        projectData: fetchFeatures(),
        projectComments: fetchComments(),
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
        const project: Project | undefined = await db.projectRepo?.findEnabledById(project_id);
        const org = await db.orgRepo.findOrgById(project?.organization_id || '');
        const member = org?.members.find(m => m.user_id === locals.user.sub);
        if (!project || !member) {
            return fail(StatusCode.UNAUTHORIZED, { message: StatusMessage.UNAUTHORIZED });
        }

        const isMember = project.members?.includes(locals.user.sub);
        if (isMember) {
            await db.projectRepo?.leave(project_id, locals.user.sub);
        } else {
            await db.projectRepo?.join(project_id, locals.user.sub);
        }

        Logger.success('User', locals.user.first_name, locals.user.last_name, 'with email', locals.user.email, 'successfully', isMember ? 'left' : 'joined', 'project with name', project.name, 'and id', project.id);
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
        const project = await db.projectRepo?.findEnabledById(project_id);
        const org = await db.orgRepo.findOrgById(project?.organization_id || '');
        const mod = org?.members.find(m =>
            m.user_id === locals.user.sub &&
            (m.org_role_id === OrgRoles.OWNER || m.org_role_id === OrgRoles.MODERATOR)
        );

        if (!project || !org || !mod) {
            return fail(StatusCode.FORBIDDEN, { message: StatusMessage.FORBIDDEN });
        }

        const org_name = org.name.replaceAll(/[^\w ]/g, '').replaceAll(' ', '').toLowerCase();
        const proj_name = project.name.replaceAll(/[^\w ]/g, '').replaceAll(' ', '').toLowerCase();
        const org_proj = `${org_name}_${proj_name}`;

        const features = Demo.generateDemo(Number.parseInt(size));
        const response = await GeoServer.WFS.insertFeatures(features, project_id, org_proj);
        if (!response) {
            // this only happens if the geojson is formatted badly
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }

        if (!response.ok) {
            return fail(StatusCode.INTERNAL_SERVER_ERROR, {message: StatusMessage.INTERNAL_SERVER_ERROR});
        }

        const data = await response.text();

        // find inserted fids
        const fids = data
            .split("wfs:InsertResults")[1]
            .split("\"")
            .filter(f => f.includes(`${GeoServerProps.Layer}.`));

        await db.fidRepo?.insertMany(project_id, fids);

        Logger.success('Project demo started with', features.length, 'features by for project', project.name, 'with id', project_id, 'by user', locals.user.first_name, locals.user.last_name, 'with email', locals.user.email);
    },

    delete: async ({request, locals}) => {
        const form = await request.formData();
        const project_id = form.get('project_id');

        if (!project_id || typeof project_id !== "string") {
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }

        const project = await db.projectRepo?.findById(project_id);
        if (!project) {
            return fail(StatusCode.NOT_FOUND, { message: StatusMessage.NOT_FOUND });
        }

        const org = await db.orgRepo?.findOrgById(project.organization_id as string);
        const isOwner = org?.members.find(m => m.org_role_id === OrgRoles.OWNER && m.user_id === locals.user.sub);
        const isAdmin = locals.user.roles.includes(UserRoles.ADMIN) || locals.user.roles.includes(UserRoles.SUPER_ADMIN);
        if (!isOwner && !isAdmin) {
            return fail(StatusCode.FORBIDDEN, { message: StatusMessage.FORBIDDEN });
        }

        await GeoServer.WFS.deleteProjectData(project_id);
        await db.fidRepo?.deleteByProject(project_id);
        await db.projectRepo?.update(project);

        Logger.success('Project data deleted for project', project.name, 'with id', project_id, 'by user', locals.user.first_name, locals.user.last_name, 'with email', locals.user.email);
    }
}
