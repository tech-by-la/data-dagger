import {
    generateDatastoreDefinitionXML, generateWfsSettingsXML,
    generateWorkspaceDefinitionXML,
    getFeatureTypeDefinitionXML
} from "$lib/server/geoserver/xml";
import {GEOSERVER_HOST, GEOSERVER_USER, GEOSERVER_PASS} from "$env/static/private";
import {GeoServerProps} from "$lib/server/util/enums";

interface IGSRest {
    getWorkspace(workspace: string): Promise<Response>;
    createWorkspace(workspace: string): Promise<Response>;

    getWfsSettings(workspace: string): Promise<Response>;
    setWfsSettings(workspace: string): Promise<Response>;

    getDatastore(store: string): Promise<Response>;
    createDatastore(store: string): Promise<Response>;

    getFeatureType(typeName: string): Promise<Response>;
    createFeatureType(): Promise<Response>;
    deleteFeatureType(featureType: string): Promise<Response>;
}

class GSRest implements IGSRest {

    private getHeaders(useXML?: boolean) {
        return {
            "Authorization": `Basic ${btoa(`${GEOSERVER_USER}:${GEOSERVER_PASS}`)}`,
            "Content-Type": `application/${useXML ? 'xml' : 'json'}`,
        };
    }

    async getWorkspace(workspace = ''): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest/workspaces/${workspace}.json`;
        return await fetch(URL, { headers: this.getHeaders() });
    }

    async createWorkspace(workspace: string): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest/workspaces?default=true`;
        return await fetch(URL, {
            method: "POST",
            headers: this.getHeaders(true),
            body: generateWorkspaceDefinitionXML(workspace),
        });
    }

    async getWfsSettings(workspace: string): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest/services/wfs/workspaces/${workspace}/settings.json`;
        return await fetch(URL, { headers: this.getHeaders() });
    }

    async setWfsSettings(workspace: string): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest/services/wfs/workspaces/${workspace}/settings`;
        return await fetch(URL, {
            method: "PUT",
            headers: this.getHeaders(true),
            body: generateWfsSettingsXML(),
        });
    }

    async getDatastore(store: string): Promise<any> {
        const URL = `${GEOSERVER_HOST}/rest/workspaces/datadagger/datastores/${store}.json`;
        return await fetch(URL, { headers: this.getHeaders() });
    }

    async createDatastore(store: string): Promise<any> {
        const URL = `${GEOSERVER_HOST}/rest/workspaces/datadagger/datastores`;
        return await fetch(URL, {
            method: "POST",
            headers: this.getHeaders(true),
            body: generateDatastoreDefinitionXML(GeoServerProps.DataStore),
        });
    }

    async getFeatureType(typeName = ''): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest/workspaces/datadagger/datastores/geodata/featuretypes/${typeName}.json`
        return await fetch(URL, { headers: this.getHeaders() });
    }

    async createFeatureType(): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest/workspaces/${GeoServerProps.Workspace}/datastores/${GeoServerProps.DataStore}/featuretypes`
        return await fetch(URL, {
            method: "POST",
            headers: this.getHeaders(true),
            body: getFeatureTypeDefinitionXML()
        });
    }

    async deleteFeatureType(featureType: string): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest//workspaces/${GeoServerProps.Workspace}/datastores/${GeoServerProps.DataStore}/featuretypes/${featureType}?recurse=true`
        return await fetch(URL, { method: "DELETE", headers: this.getHeaders() });
    }
}

export default new GSRest();
