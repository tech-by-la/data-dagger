import Logger from "$lib/server/util/Logger";
import {GeoServerProps} from "$lib/server/util/enums";
import {GEOSERVER_HOST, GEOSERVER_PASS, GEOSERVER_USER, POSTGIS_PASS, POSTGIS_USER} from "$env/static/private";
import workspace from "$lib/server/geoserver/json/workspace.json";
import {webkit} from "playwright";
import datastore from "$lib/server/geoserver/json/datastore.json";
import featureType from "$lib/server/geoserver/json/feature-type.json";
import commentType from "$lib/server/geoserver/json/comment-type.json";

interface IRest {
    init(): Promise<void>;
}

class REST implements IRest {

    public async init() {
        try {
            Logger.log('GeoServer:', 'Initializing...');
            const wsResponse = await this.fetchWorkspace(GeoServerProps.Workspace);
            if (!wsResponse.ok) await this.createWorkspace();
            const wfsResponse = await this.fetchWfsSettings(GeoServerProps.Workspace);
            if (!wfsResponse.ok) await this.enableWfs(GeoServerProps.Workspace)
            const dsResponse = await this.fetchDatastore(GeoServerProps.DataStore);
            if (!dsResponse.ok) await this.createDatastore();
            const ftResponse = await this.fetchFeatureType('poly');
            if (!ftResponse.ok) await this.createFeatureType(featureType); // TODO: feature type def is hardcoded, it shouldn't be.
            const cmResponse = await this.fetchFeatureType('comment');
            if (!cmResponse.ok) await this.createFeatureType(commentType); // TODO: feature type def is hardcoded, it shouldn't be.
            Logger.log('GeoServer:', 'Finished initializing!');
        } catch (e) {
            Logger.error('GeoServer:', 'Could not initialize!');
        }
    }

    private readonly headers = {
        "Authorization": `Basic ${btoa(`${GEOSERVER_USER}:${GEOSERVER_PASS}`)}`,
        "Content-Type": "application/json",
    }

    private async fetchWorkspace(workspace = ''): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest/workspaces/${workspace}.json`;
        const response = await fetch(URL, { headers: this.headers });
        Logger.log('GeoServer:', response.ok ? 'Workspace found!' : 'Workspace not found!')
        return response;
    }

    private async createWorkspace(): Promise<Response> {
        Logger.log('GeoServer:', 'Creating workspace...');
        const URL = `${GEOSERVER_HOST}/rest/workspaces?default=true`;
        const response = await fetch(URL, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(workspace),
        });
        Logger.log('GeoServer:', response.ok ? 'Workspace created!' : 'Could not create workspace!');
        return response;
    }

    private async fetchWfsSettings(workspace: string): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest/services/wfs/workspaces/${workspace}/settings.json`;
        const response = await fetch(URL, { headers: this.headers });
        Logger.log('GeoServer:', response.ok ? 'WFS is enabled!' : 'WFS is disabled!');
        return response;
    }

    // Launches a virtual server to click a checkbox cause there's no RESTful way of doing it (thanks GeoServer)
    private async enableWfs(workspace: string) {
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

    private async fetchDatastore(store: string): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest/workspaces/datadagger/datastores/${store}.json`;
        const response = await fetch(URL, { headers: this.headers });
        Logger.log('GeoServer:', response.ok ? 'Datastore found' : 'Could not find datastore');
        return response;
    }

    private async createDatastore(): Promise<Response> {
        Logger.log('GeoServer:', 'Creating datastore...');
        const URL = `${GEOSERVER_HOST}/rest/workspaces/datadagger/datastores`;
        const ds = {...datastore};
        ds.dataStore.connectionParameters.user   = POSTGIS_USER;
        ds.dataStore.connectionParameters.passwd = POSTGIS_PASS;
        const response = await fetch(URL, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(ds),
        });
        Logger.log('GeoServer:', response.ok ? 'Successfully created datastore!' : 'Could not create datastore!');
        return response;
    }

    private async fetchFeatureType(typeName = ''): Promise<Response> {
        const URL = `${GEOSERVER_HOST}/rest/workspaces/datadagger/datastores/geodata/featuretypes/${typeName}.json`
        const response = await fetch(URL, { headers: this.headers });
        Logger.log('GeoServer:', response.ok ? 'Feature-type found!' : 'Feature-type not found');
        return response;
    }

    private async createFeatureType(featureType: any): Promise<Response> {
        Logger.log('GeoServer:', 'Creating feature-type...');
        const URL = `${GEOSERVER_HOST}/rest/workspaces/${GeoServerProps.Workspace}/datastores/${GeoServerProps.DataStore}/featuretypes`
        const response = await fetch(URL, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(featureType),
        });
        Logger.log('GeoServer:', response.ok ? 'Successfully created feature-type!' : 'Could not create feature-type!');
        return response;
    }

    public async updateFeatureType(featureType: any): Promise<Response> {
        Logger.log('GeoServer:', 'Updating feature-type...');
        const URL = `${GEOSERVER_HOST}/rest/workspaces/${GeoServerProps.Workspace}/datastores/${GeoServerProps.DataStore}/featuretypes/${featureType.featureType.name}`
        const response = await fetch(URL, {
            method: "PUT",
            headers: this.headers,
            body: JSON.stringify(featureType),
        });
        Logger.log('GeoServer:', response.ok ? 'Successfully updated feature-type!' : 'Could not update feature-type!');
        return response;
    }
}

export default new REST();
