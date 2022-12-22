import type {PageServerLoad} from "./$types";
import geojson from '$lib/assets/geojson/1KM_tiles.json';
import {geojsonToXml} from "$lib/server/util/wfs";

export const load: PageServerLoad = ({fetch}) => {

    (async () => {
        const { features } = geojson as {[key: string]: any};
        const xml = geojsonToXml([features[0], features[1]])
        const URL = 'http://localhost:9090/geoserver/wfs';

        const response = await fetch(URL, {
            method: "POST",
            body: xml,
        });

        const data = await response.text();
        console.log(data);

    })()


}
