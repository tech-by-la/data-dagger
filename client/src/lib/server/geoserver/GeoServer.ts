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
    setWfsSettings(workspace: string): Promise<Response>;
    enableWfs(workspace: string): Promise<any>;

    getDatastore(store: string): Promise<Response>;
    createDatastore(store: string): Promise<Response>;

    getFeatureType(typeName: string): Promise<Response>;
    createFeatureType(): Promise<Response>;
    deleteFeatureType(featureType: string): Promise<Response>;
}

class GeoServer implements IGSRest {

    public async init() {
        Logger.log('GeoServer:', 'Initializing');
        const wsResponse = await this.getWorkspace(GeoServerProps.Workspace);
        if (!wsResponse.ok) await this.createWorkspace(GeoServerProps.Workspace);
        const wfsResponse = await this.getWfsSettings(GeoServerProps.Workspace);
        if (!wfsResponse.ok) await this.enableWfs(GeoServerProps.Workspace)
        const dsResponse = await this.getDatastore(GeoServerProps.DataStore);
        if (!dsResponse.ok) await this.createDatastore(GeoServerProps.DataStore);
        const ftResponse = await this.getFeatureType('poly');
        if (!ftResponse.ok) await this.createFeatureType(); // TODO: feature type def is hardcoded, it shouldn't be.
        Logger.log('GeoServer:', 'Finished initializing');
    }

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

    async enableWfs(workspace: string) {
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
        Logger.log('Playwright:', 'Clicked save!');
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

export default new GeoServer();
