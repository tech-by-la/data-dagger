import type {PageServerLoad} from "./$types";
import GeoServer from "$lib/server/geoserver/GeoServer";
import type {Actions} from "@sveltejs/kit";
import {FeatureStatus, StatusCode, StatusMessage} from "$lib/server/util/enums";
import {fail} from "@sveltejs/kit";

export const load: PageServerLoad = (async ({parent, params}) => {
    await parent();

    const fetchNextFeature = async () => {
        const response = await GeoServer.WFS.fetchNextFeature(params.projectId);
        // console.log(await response.text())
        const data = await response.json();
        return { nextFeature: data.features[0] }
    }

    return fetchNextFeature()
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async ({request}) => {
        const form = await request.formData();
        const organization_id = form.get('org_id');
        const status = form.get('status');

        if (
            !organization_id || typeof organization_id !== "string" ||
            !status || typeof status !== "string" ||
            !Object.values(FeatureStatus).includes(status)
        ) {
            return fail(StatusCode.BAD_REQUEST, { message: StatusMessage.BAD_REQUEST });
        }


    }
}
