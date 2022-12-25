import {getFeatureTypeDefinitionXML} from "$lib/server/geoserver/xml";
import {GEOSERVER_HOST} from "$env/static/private";
import {GeoServerProps} from "$lib/server/util/enums";

interface IGSRest {
    getFeatureType(typeName: string): Promise<Response>;
    createFeatureType(): Promise<Response>;
    deleteFeatureType(featureType: string): Promise<Response>;
}

class GSRest implements IGSRest {
    async getFeatureType(typeName = ''): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest/workspaces/datadagger/datastores/geodata/featuretypes/${typeName}`
        return await fetch(URL).then();
    }

    async createFeatureType(): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest/workspaces/${GeoServerProps.Workspace}/datastores/${GeoServerProps.DataStore}/featuretypes`
        return await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/xml" },
            body: getFeatureTypeDefinitionXML()
        });
    }

    async deleteFeatureType(featureType: string): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest//workspaces/${GeoServerProps.Workspace}/datastores/${GeoServerProps.DataStore}/featuretypes/${featureType}?recurse=true`
        return await fetch(URL, { method: "DELETE" });
    }
}

export default new GSRest();


