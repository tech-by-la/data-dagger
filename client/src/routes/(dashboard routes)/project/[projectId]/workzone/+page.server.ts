import type {PageServerLoad} from "./$types";
import type {Actions} from "@sveltejs/kit";
import {fail, redirect} from "@sveltejs/kit";

import {FeatureStatus, StatusCode, StatusMessage} from "$lib/server/util/enums";
import GeoServer from "$lib/server/geoserver/GeoServer";
import db from "$lib/server/database/DatabaseGateway";

export const load: PageServerLoad = (async ({parent, params}) => {
    await parent();

    const fetchNextFeature = async () => {
        const response = await GeoServer.WFS.fetchNextFeature(params.projectId);
        // console.log(await response.text())
        const data = await response.json();
        console.log(data);
        if (data.features.length === 0) {
            throw redirect(302, `/project/${params.projectId}`);
        }
        return { nextFeature: data.features[0] }
    }

    return fetchNextFeature()
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async ({request, locals}) => {
        const form = await request.formData();
        const feature_id = form.get('feature_id');
        const project_id = form.get('project_id');
        const status = form.get('status');

        if (
            !feature_id || typeof feature_id !== "string" ||
            !project_id || typeof project_id !== "string" ||
            !status || typeof status !== "string" ||
            !Object.values(FeatureStatus).includes(status as FeatureStatus)
        ) {
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }

        const project = await db.projectRepo.findEnabledById(project_id);
        const isMember = project?.members?.includes(locals.user.sub);
        if (!project || !isMember) {
            return fail(StatusCode.FORBIDDEN, { message: StatusMessage.FORBIDDEN });
        }

        await GeoServer.WFS.updateFeature(feature_id, status as FeatureStatus, locals.user.email);
    }
}
