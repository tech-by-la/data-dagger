import type {CommentFeature, Feature} from "$lib/server/util/interfaces";
import {GEOSERVER_HOST, GEOSERVER_PASS, GEOSERVER_USER} from "$env/static/private";
import {
    generateWfsCommentInsertRequest,
    generateWfsDeleteRequest,
    generateWfsInsertRequest,
    generateWfsUpdateRequest
} from "$lib/server/geoserver/xml";
import {FeatureStatus, GeoServerProps} from "$lib/server/util/enums";

interface IWFS {
    insertFeatures(tileData: Feature[], project_id: string): Promise<Response | null>;
    fetchFeaturesByProject(project_id: string): Promise<Response>;
    fetchNextFeature(project_id: string): Promise<Response>;
    updateFeature(feature_id: string, project_id: string, status: FeatureStatus): Promise<Response>;
    insertComments(comments: []): Promise<Response>;
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

        return await fetch(URL, { headers: this.headers });
    }

    public async fetchNextFeature(fid: string): Promise<Response> {
        const URL =
            `${GEOSERVER_HOST}/${GeoServerProps.Workspace}/wfs?service=WFS&version=2.0.0` +
            `&request=GetFeature` +
            `&outputFormat=json` +
            `&typeNames=${GeoServerProps.Layer}` +
            `&featureID=${fid}` +
            `&count=1`
        return await fetch(URL, { headers: this.headers });
    }

    // TODO
    public async updateFeature(feature_id: string, status: FeatureStatus, checked_by: string): Promise<Response> {
        const xml = generateWfsUpdateRequest(feature_id, status, checked_by);
        return await this.sendRequest(xml);
    }

    public async insertComments(comments: CommentFeature[]): Promise<Response> {
        const xml = generateWfsCommentInsertRequest(comments);
        return await this.sendRequest(xml);
    }

    public async deleteProjectData(project_id: string): Promise<Response> {
        const xml = generateWfsDeleteRequest(project_id);
        return await this.sendRequest(xml);
    }
}

export default new WFS();
