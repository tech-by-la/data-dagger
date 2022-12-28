import type {Feature} from "$lib/server/util/interfaces";
import {GEOSERVER_HOST, GEOSERVER_PASS, GEOSERVER_USER} from "$env/static/private";
import {generateWfsDeleteRequest, generateWfsInsertRequest, generateWfsUpdateRequest} from "$lib/server/geoserver/xml";
import {FeatureStatus, GeoServerProps} from "$lib/server/util/enums";
import OLWFS from 'ol/format/WFS';

interface IWFS {
    insertFeatures(tileData: Feature[], project_id: string): Promise<Response | null>;
    fetchFeaturesByProject(project_id: string): Promise<Response>;
    fetchNextFeature(project_id: string): Promise<Response>;

    updateFeature(feature_id: string, project_id: string, status: FeatureStatus): Promise<Response>;
    getNextProjectTile(project_id: string): Promise<Response>;
    deleteProjectData(project_id: string): Promise<Response>;
}

class WFS implements IWFS {

    private readonly headers = { "Authorization": `Basic ${btoa(`${GEOSERVER_USER}:${GEOSERVER_PASS}`)}`};

    private async sendRequest(xml: string): Promise<Response> {
        return await fetch(`${GEOSERVER_HOST}/wfs`, {
            method: "POST",
            headers: this.headers,
            body: xml,
        });
    }

    public async insertFeatures(tileData: Feature[], project_id: string): Promise<Response | null> {
        const xml = generateWfsInsertRequest(tileData, project_id);
        if (!xml) return null;
        return await this.sendRequest(xml);
    }

    public async fetchFeaturesByProject(project_id: string): Promise<Response> {
        const URL =
            `${GEOSERVER_HOST}/${GeoServerProps.Workspace}/ows?service=WFS&version=2.0.0&request=GetFeature` +
            `&outputFormat=json` +
            `&typeNames=${GeoServerProps.Layer}` +
            `&Filter=` +
                `<Filter><PropertyIsEqualTo>` +
                    `<PropertyName>project_id</PropertyName><Literal>${project_id}</Literal>` +
                `</PropertyIsEqualTo></Filter>`

        return await fetch(URL);
    }

    public async fetchNextFeature(project_id: string): Promise<Response> {
        const URL =
            `${GEOSERVER_HOST}/${GeoServerProps.Workspace}/ows?service=WFS&version=2.0.0&request=GetFeature` +
            `&outputFormat=json` +
            `&typeNames=${GeoServerProps.Layer}` +
            `&Filter=` +
                `<Filter>` +
                    `<PropertyIsEqualTo>` +
                        `<PropertyName>project_id</PropertyName><Literal>${project_id}</Literal>` +
                    `</PropertyIsEqualTo>` +
                    `<PropertyIsEqualTo>` +
                        `<PropertyName>status</PropertyName><Literal>${FeatureStatus.ready}</Literal>` +
                    `</PropertyIsEqualTo>` +
                `</Filter>` +
            `&count=1`
        return await fetch(URL);
    }

    // TODO
    public async updateFeature(feature_id: string, status: FeatureStatus, checked_by: string): Promise<Response> {
        const xml = generateWfsUpdateRequest(feature_id, status, checked_by);
        return await this.sendRequest(xml);
    }

    // TODO
    public async getNextProjectTile(project_id: string): Promise<any> {
        return Promise.resolve(undefined);
    }

    public async deleteProjectData(project_id: string): Promise<any> {
        const xml = generateWfsDeleteRequest(project_id);
        return await this.sendRequest(xml);
    }
}

export default new WFS();
