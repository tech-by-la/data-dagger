import type {Feature} from "$lib/server/util/interfaces";
import {Geometries, GeoServerProps} from "$lib/server/util/enums";
import {GEOSERVER_HOST} from "$env/static/private";

/*
 * Converts geojson features to XML and prepares the request.
 * This conversion is hand-tailored to suit our specific FeatureType as we have defined them in the GeoServer.
 * @params tileData Feature[]
 * @returns: XML string or undefined
 */
export const generateWfsInsertRequest = (tileData: Feature[], project_id: string) => {

    let xml = transactionOpenTag + insertOpenTag;

    if (tileData.length === 0) return;

    tile:
    for (const tile of tileData) {
        const {properties, geometry} = tile;

        // Check for all required properties
        if (
            !properties || !properties.id || !properties.ogc_fid || !properties.ogr_fid ||
            (!properties.navn && !properties.name) ||
            !geometry || !geometry.type || !geometry.coordinates ||
            geometry.coordinates.length !== 1 || geometry.coordinates[0].length === 0
        ) continue;

        let insert = featureOpenTag;

        // Convert the_geom (a Polygon)
        if (geometry && geometry.type === Geometries.Polygon) {
            insert += geomOpenTags;
            let coords = ''
            for (const coord of geometry.coordinates[0]) {
                if (coord.length !== 2) continue tile;
                coords += `${coord[0]},${coord[1]} `
            }
            insert += coords.trim() + geomCloseTags;
        } else continue;

        // Insert primitive properties
        insert += `
            <${GeoServerProps.Workspace}:project_id>${project_id}</${GeoServerProps.Workspace}:project_id>
            <${GeoServerProps.Workspace}:id>${properties.id}</${GeoServerProps.Workspace}:id>
            <${GeoServerProps.Workspace}:ogc_fid>${properties.ogc_fid}</${GeoServerProps.Workspace}:ogc_fid>
            <${GeoServerProps.Workspace}:ogr_fid>${properties.ogr_fid}</${GeoServerProps.Workspace}:ogr_fid>
            <${GeoServerProps.Workspace}:checked>${false}</${GeoServerProps.Workspace}:checked>
            <${GeoServerProps.Workspace}:name>${properties.name || properties.navn}</${GeoServerProps.Workspace}:name>
        `;

        insert += featureCloseTag;
        xml    += insert;
    }

    xml += insertCloseTag + transactionCloseTag;
    return xml;
}

/*
 * Generates the XML used in WFS Delete requests.
 * When sent this request will delete all tiles for a given project.
 * @params project_id: string
 * @returns: XML string
 */
export const generateWfsDeleteRequest = (project_id: string) => {
    return `
        ${transactionOpenTag}
            <wfs:Delete typeName="${GeoServerProps.Workspace}:${GeoServerProps.Layer}">
                <ogc:Filter>
                    <ogc:PropertyIsEqualTo>
                        <ogc:PropertyName>${GeoServerProps.Workspace}:project_id</ogc:PropertyName>
                        <ogc:Literal>${project_id}</ogc:Literal>
                    </ogc:PropertyIsEqualTo>
                </ogc:Filter>
            </wfs:Delete>
        ${transactionCloseTag}
    `;
}


// ===== DEFAULT XML STRINGS ===== //

const transactionOpenTag = `
    <wfs:Transaction service="WFS" version="1.1.0"
        outputFormat="application/json"
        xmlns:wfs="http://www.opengis.net/wfs" 
        xmlns:gml="http://www.opengis.net/gml" 
        xmlns:ogc="http://www.opengis.net/ogc"
        xmlns:datadagger="${GEOSERVER_HOST}/datadagger" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd ${GEOSERVER_HOST}/wfs/DescribeFeatureType?typename=${GeoServerProps.Layer}"
    >
`;

const transactionCloseTag = `</wfs:Transaction>`;

const insertOpenTag   = `<wfs:Insert>`;
const insertCloseTag  = `</wfs:Insert>`;

const featureOpenTag  = `<${GeoServerProps.Workspace}:${GeoServerProps.Layer}>`
const featureCloseTag = `</${GeoServerProps.Workspace}:${GeoServerProps.Layer}>`

const geomOpenTags = `
    <${GeoServerProps.Workspace}:the_geom>
    <gml:Polygon srsName="EPSG:${GeoServerProps.EPSG}">
    <gml:exterior>
    <gml:LinearRing>
    <gml:coordinates>
`;

const geomCloseTags = `
    </gml:coordinates>
    </gml:LinearRing>
    </gml:exterior>
    </gml:Polygon>
    </${GeoServerProps.Workspace}:the_geom>
`;
