import type {PageServerLoad} from "./$types";
import type {Actions} from "@sveltejs/kit";
import {error, fail, redirect} from "@sveltejs/kit";

import {FeatureStatus, StatusCode, StatusMessage} from "$lib/server/util/enums";
import GeoServer from "$lib/server/geoserver/GeoServer";
import db from "$lib/server/database/DatabaseGateway";
import type {CommentFeature} from "$lib/server/util/interfaces";

export const load: PageServerLoad = (async ({parent, params, locals}) => {
    await parent();

    const fetchNextFeature = async () => {
        const nextFeature = await db.fidRepo.findOneAvailableAndLock(params.projectId, locals.user.sub);
        if (!nextFeature?.fid) {
            throw redirect(302, `/project/${params.projectId}`);
        }

        const response = await GeoServer.WFS.fetchNextFeature(nextFeature.fid as string);

        if (!response.ok) {
            throw error(response.status);
        }

        const data = await response.json();
        if (data.features.length === 0) {
            throw redirect(302, `/project/${params.projectId}`);
        }
        return { nextFeature: {...data.features[0]} }
    }

    return fetchNextFeature()
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async ({request, locals}) => {
        const form = await request.formData();
        const feature_id = form.get('feature_id');
        const project_id = form.get('project_id');
        const status = form.get('status');
        let comments = form.get('comments');

        if (comments) comments = JSON.parse(comments as string);

        if (
            !feature_id || typeof feature_id !== "string" ||
            !project_id || typeof project_id !== "string" ||
            !status || typeof status !== "string" ||
            !Object.values(FeatureStatus).includes(status as FeatureStatus) ||
            !comments || !Array.isArray(comments)
        ) {
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }

        // validate comment layer
        for (const comment of comments) {
            if (
                !comment.feature     || !comment.name ||
                !comment.status      || !comment.org_proj ||
                !comment.description || !comment.action ||
                !comment.reported_by || !comment.project_id ||
                !comment.feature.values_.geometry?.flatCoordinates ||
                !Array.isArray(comment.feature.values_.geometry.flatCoordinates) ||
                comment.feature.values_?.geometry?.flatCoordinates?.length % 2 !== 0
            ) {
                return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
            }

            for (const coord of comment.feature.values_.geometry.flatCoordinates) {
                if (typeof coord !== "number") {
                    return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
                }
            }
        }

        const project = await db.projectRepo.findEnabledById(project_id);
        const isMember = project?.members?.includes(locals.user.sub);
        if (!project || !isMember) {
            return fail(StatusCode.FORBIDDEN, { message: StatusMessage.FORBIDDEN });
        }

        const response = await GeoServer.WFS.updateFeature(feature_id, status as FeatureStatus, locals.user.email);
        const data = await response.text();
        const updated = Number.parseInt(data.split('wfs:totalUpdated')[1].replace(/[^\w ]/g, ''));
        if (response.ok && !isNaN(updated) && updated === 1) {
            await db.fidRepo.setChecked(feature_id);
        }

        if (comments.length > 0) {
            await GeoServer.WFS.insertComments(comments as CommentFeature[]);
        }
    }
}
