import {
    generateDatastoreDefinitionXML, generateWfsSettingsXML,
    generateWorkspaceDefinitionXML,
    getFeatureTypeDefinitionXML
} from "$lib/server/geoserver/xml";
import {GEOSERVER_HOST, GEOSERVER_USER, GEOSERVER_PASS} from "$env/static/private";
import {GeoServerProps} from "$lib/server/util/enums";
import { webkit } from "playwright";
import Logger from "$lib/server/util/Logger";

interface IGSRest {
    init(): Promise<void>;

    getWorkspace(workspace: string): Promise<Response>;
    createWorkspace(workspace: string): Promise<Response>;

    getWfsSettings(workspace: string): Promise<Response>;
    enableWfs(workspace: string): Promise<any>;

    getDatastore(store: string): Promise<Response>;
    createDatastore(store: string): Promise<Response>;

    getFeatureType(typeName: string): Promise<Response>;
    createFeatureType(): Promise<Response>;
    deleteFeatureType(featureType: string): Promise<Response>;
}

class GeoServer implements IGSRest {

    public async init() {
        Logger.log('GeoServer:', 'Initializing...');
        const wsResponse = await this.getWorkspace(GeoServerProps.Workspace);
        if (!wsResponse.ok) await this.createWorkspace(GeoServerProps.Workspace);
        const wfsResponse = await this.getWfsSettings(GeoServerProps.Workspace);
        if (!wfsResponse.ok) await this.enableWfs(GeoServerProps.Workspace)
        const dsResponse = await this.getDatastore(GeoServerProps.DataStore);
        if (!dsResponse.ok) await this.createDatastore(GeoServerProps.DataStore);
        const ftResponse = await this.getFeatureType('poly');
        if (!ftResponse.ok) await this.createFeatureType(); // TODO: feature type def is hardcoded, it shouldn't be.
        Logger.log('GeoServer:', 'Finished initializing!');
    }

    private getHeaders(useXML?: boolean) {
        return {
            "Authorization": `Basic ${btoa(`${GEOSERVER_USER}:${GEOSERVER_PASS}`)}`,
            "Content-Type": `application/${useXML ? 'xml' : 'json'}`,
        };
    }

    async getWorkspace(workspace = ''): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest/workspaces/${workspace}.json`;
        const response = await fetch(URL, { headers: this.getHeaders() });
        Logger.log('GeoServer:', response.ok ? 'Workspace found!' : 'Workspace not found!')
        return response;
    }

    async createWorkspace(workspace: string): Promise<Response> {
        Logger.log('GeoServer:', 'Creating workspace...');
        const URL = `${GEOSERVER_HOST}/rest/workspaces?default=true`;
        const response = await fetch(URL, {
            method: "POST",
            headers: this.getHeaders(true),
            body: generateWorkspaceDefinitionXML(workspace),
        });
        Logger.log('GeoServer:', response.ok ? 'Workspace created!' : 'Could not create workspace!');
        return response;
    }

    async getWfsSettings(workspace: string): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest/services/wfs/workspaces/${workspace}/settings.json`;
        const response = await fetch(URL, { headers: this.getHeaders() });
        Logger.log('GeoServer:', response.ok ? 'WFS is enabled!' : 'WFS is disabled!');
        return response;
    }

    async enableWfs(workspace: string) {
        Logger.log('GeoServer:', 'Enabling WFS...');
        const browser = await webkit.launch();
        const page = await browser.newPage();
        await page.goto(GEOSERVER_HOST);
        Logger.log('Playwright:', 'Navigated to', GEOSERVER_HOST);
        await page.getByLabel('username').fill(GEOSERVER_USER);
        Logger.log('Playwright:', 'Filled username');
        await page.getByLabel('password').fill(GEOSERVER_PASS);
        Logger.log('Playwright:', 'filled password');
        await page.click('button');
        Logger.log('Playwright:', 'Clicked login button');
        await page.goto(`${GEOSERVER_HOST}/web/wicket/bookmarkable/org.geoserver.web.data.workspace.WorkspaceEditPage?5&name=${workspace}`);
        Logger.log('Playwright:', 'Navigated to settings page for workspace', workspace);
        await page.locator('input[name="tabs\\:panel\\:services\\:services\\:2\\:enabled"]').check();
        Logger.log('Playwright:', 'Checked WFS checkbox to enable WFS');
        await page.click('.form-button-save');
        Logger.log('Playwright:', 'Clicked save');
        Logger.log('GeoServer:', 'Successfully enabled WFS!');
    }

    async getDatastore(store: string): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest/workspaces/datadagger/datastores/${store}.json`;
        const response = await fetch(URL, { headers: this.getHeaders() });
        Logger.log('GeoServer:', response.ok ? 'Datastore found' : 'Could not find datastore');
        return response;
    }

    async createDatastore(store: string): Promise<Response> {
        Logger.log('GeoServer:', 'Creating datastore...');
        const URL = `${GEOSERVER_HOST}/rest/workspaces/datadagger/datastores`;
        const response = await fetch(URL, {
            method: "POST",
            headers: this.getHeaders(true),
            body: generateDatastoreDefinitionXML(GeoServerProps.DataStore),
        });
        Logger.log('GeoServer:', response.ok ? 'Successfully created datastore!' : 'Could not create datastore!');
        return response;
    }

    async getFeatureType(typeName = ''): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest/workspaces/datadagger/datastores/geodata/featuretypes/${typeName}.json`
        const response = await fetch(URL, { headers: this.getHeaders() });
        Logger.log('GeoServer:', response.ok ? 'Feature-type found!' : 'Feature-type not found');
        return response;
    }

    async createFeatureType(): Promise<Response> {
        Logger.log('GeoServer:', 'Creating feature-type...');
        const URL = `${GEOSERVER_HOST}/rest/workspaces/${GeoServerProps.Workspace}/datastores/${GeoServerProps.DataStore}/featuretypes`
        const response = await fetch(URL, {
            method: "POST",
            headers: this.getHeaders(true),
            body: getFeatureTypeDefinitionXML()
        });
        Logger.log('GeoServer:', response.ok ? 'Successfully created feature-type!' : 'Could not create feature-type!');
        return response;
    }

    async deleteFeatureType(featureType: string): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest//workspaces/${GeoServerProps.Workspace}/datastores/${GeoServerProps.DataStore}/featuretypes/${featureType}?recurse=true`
        return await fetch(URL, { method: "DELETE", headers: this.getHeaders() });
    }
}

export default new GeoServer();
