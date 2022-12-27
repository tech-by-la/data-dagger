import {GEOSERVER_HOST, GEOSERVER_PASS, GEOSERVER_USER} from "$env/static/private";
import {generateWfsDeleteRequest, generateWfsInsertRequest} from "$lib/server/geoserver/xml";
import type {Feature} from "$lib/server/util/interfaces";

interface IWFS {
    insertProjectTiles(tileData: Feature[], project_id: string): Promise<Response | null>;
    getAllProjectTiles(project_id: string): Promise<Response>;
    updateTile(tile_id: number, project_id: string): Promise<Response>;
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

    public async insertProjectTiles(tileData: Feature[], project_id: string): Promise<Response | null> {
        const xml = generateWfsInsertRequest(tileData, project_id);
        if (!xml) return null;
        return await this.sendRequest(xml);
    }

    // TODO
    public async getAllProjectTiles(project_id: string): Promise<any> {
        return Promise.resolve(undefined);
    }

    // TODO
    public async updateTile(tile_id: number, project_id: string): Promise<any> {
        return Promise.resolve(undefined);
    }

    // TODO
    public async getNextProjectTile(project_id: string): Promise<any> {
        return Promise.resolve(undefined);
    }

    public async deleteProjectData(project_id: string): Promise<Response> {
        const xml = generateWfsDeleteRequest(project_id);
        return await this.sendRequest(xml);
    }
}

export default new WFS();
