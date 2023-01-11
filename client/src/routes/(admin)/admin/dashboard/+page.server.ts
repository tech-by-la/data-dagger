import type {PageServerLoad} from "./$types";
import db from '$lib/server/database/DatabaseGateway';
import type {Actions} from "@sveltejs/kit";
import GeoServer from "$lib/server/geoserver/GeoServer";
import featureType from '$lib/server/geoserver/json/feature-type.json';
import {fail} from "@sveltejs/kit";

export const load: PageServerLoad = async ({parent, locals}) => {
    await parent();

    return {
        allUsers: db.userRepo.count(),
        allOrganizations: db.orgRepo.count(),
        allProjects: db.projectRepo?.count(),
        unreadLogs: db.logRepo?.countUnread(locals.user.sub),
    }
}

export const actions: Actions = {
    default: async () => {
        const response = await GeoServer.REST.updateFeatureType(featureType);
        if (!response.ok) {
            return fail(response.status, { message: 'Could not update feature type...' });
        }
    }
}
