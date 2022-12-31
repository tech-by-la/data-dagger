import type {PageServerLoad} from "./$types";
import db from '$lib/server/database/DatabaseGateway';
import type {Actions} from "@sveltejs/kit";
import GeoServer from "$lib/server/geoserver/GeoServer";
import featureType from '$lib/server/geoserver/json/feature-type.json';
import {fail} from "@sveltejs/kit";

export const load: PageServerLoad = async ({parent}) => {
    await parent();

    const getUsers = async () => {
        return await db.userRepo.count();
    }

    const getOrganizations = async () => {
        return await db.orgRepo.count();
    }
    const getProjects = async () => {
        return await db.projectRepo.count();
    }

    return {
        allUsers: getUsers(),
        allOrganizations: getOrganizations(),
        allProjects: getProjects(),
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
