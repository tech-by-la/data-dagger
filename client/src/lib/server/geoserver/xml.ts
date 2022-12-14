import type {CommentFeature, Feature} from "$lib/server/util/interfaces";
import {Geometries, GeoServerProps, FeatureStatus} from "$lib/server/util/enums";

/*
 * Converts geojson features to XML and prepares the request.
 * This conversion is hand-tailored to suit our specific FeatureType as we have defined them in the GeoServer.
 * @params tileData Feature[]
 * @returns: XML string or undefined
 */
export const generateWfsInsertRequest = (tileData: Feature[], project_id: string, org_proj: string) => {

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
            <project_id>${project_id}</project_id>
            <id>${properties.id}</id>
            <ogc_fid>${properties.ogc_fid}</ogc_fid>
            <ogr_fid>${properties.ogr_fid}</ogr_fid>
            <name>${properties.name || properties.navn}</name>
            <org_proj>${org_proj}</org_proj>
            <status>${FeatureStatus.ready}</status>
        `;

        insert += featureCloseTag;
        xml    += insert;
    }

    xml += insertCloseTag + transactionCloseTag;
    return xml;
}

export const generateWfsUpdateRequest = (fid: string, status: string, checked_by: string) => {
    return transactionOpenTag + `
        <wfs:Update typeName="${GeoServerProps.Layer}">
            <wfs:Property>
                <wfs:Name>status</wfs:Name>
                <wfs:Value>${status}</wfs:Value>
            </wfs:Property>
            <wfs:Property>
                <wfs:Name>checked_by</wfs:Name>
                <wfs:Value>${checked_by}</wfs:Value>
            </wfs:Property>
            <ogc:Filter>
                <ogc:FeatureId fid="${fid}"/>
            </ogc:Filter>
        </wfs:Update>
    ` + transactionCloseTag;
}

/*
 * Generates the XML used in WFS Delete requests.
 * When sent this request will delete all tiles for a given project.
 * @params project_id: string
 * @returns: XML string
 */
export const generateWfsDeleteRequest = (featureType: string, project_id: string) => {
    return `
        ${transactionOpenTag}
            <wfs:Delete typeName="${featureType}">
                <ogc:Filter>
                    <ogc:PropertyIsEqualTo>
                        <ogc:PropertyName>project_id</ogc:PropertyName>
                        <ogc:Literal>${project_id}</ogc:Literal>
                    </ogc:PropertyIsEqualTo>
                </ogc:Filter>
            </wfs:Delete>
        ${transactionCloseTag}
    `;
}

export const generateWfsCommentInsertRequest = (comments: CommentFeature[]) => {
    let xml = transactionOpenTag + insertOpenTag;

    for (const comment of comments) {
        const coordinates = comment.feature.values_.geometry.flatCoordinates;

        let insert = commentOpenTag;

        // geometry
        insert += geomOpenTags;
        let coords = ''
        for (const [index, coord] of coordinates.entries()) {
            coords += index === coordinates.length - 1
                ? coord
                : index % 2 === 0
                ? `${coord},`
                : `${coord} `;
        }

        insert += coords.trim() + geomCloseTags;

        // properties
        insert += `
            <name>${comment.name}</name>
            <status>${comment.status}</status>
            <org_proj>${comment.org_proj}</org_proj>
            <project_id>${comment.project_id}</project_id>
            <description>${comment.description}</description>
            <action>${comment.action}</action>
            <reported_by>${comment.reported_by}</reported_by>
        `;

        insert += commentCloseTag;
        xml    += insert;
    }

    xml += insertCloseTag + transactionCloseTag;
    return xml;
}

// ===== DEFAULT XML STRINGS ===== //

const transactionOpenTag = `
    <wfs:Transaction service="WFS" version="1.1.0"
        outputFormat="application/json"
        xmlns:wfs="http://www.opengis.net/wfs" 
        xmlns:gml="http://www.opengis.net/gml" 
        xmlns:ogc="http://www.opengis.net/ogc" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"
    >
`;

const transactionCloseTag = `</wfs:Transaction>`;

const insertOpenTag   = `<wfs:Insert>`;
const insertCloseTag  = `</wfs:Insert>`;

const featureOpenTag  = `<${GeoServerProps.Layer}>`
const featureCloseTag = `</${GeoServerProps.Layer}>`
const commentOpenTag  = `<${GeoServerProps.Comment}>`
const commentCloseTag = `</${GeoServerProps.Comment}>`

const geomOpenTags = `
    <the_geom>
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
    </the_geom>
`;
