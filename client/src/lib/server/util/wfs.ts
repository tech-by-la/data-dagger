export const geojsonToXml = (geojson: any[]) => {

    let xml = transactionOpenTag;
    for (const geo of geojson) {
        let insert = insertOpenTags

        let coords = ''
        for (const coord of geo.geometry.coordinates[0]) {
            coords += `${coord[0]},${coord[1]} `
        }

        insert += coords.trim() + insertCloseTags;
        xml += insert;

    }

    xml += transactionCloseTag;
    return xml;
}

const transactionOpenTag = `<wfs:Transaction xmlns:wfs="http://www.opengis.net/wfs" xmlns:gml="http://www.opengis.net/gml" xmlns:datadagger="http://localhost:9090/geoserver/datadagger" service="WFS" version="1.1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd http://localhost:9090/geoserver/wfs/DescribeFeatureType?typename=polygontest">`;
const transactionCloseTag = `</wfs:Transaction>`


const insertOpenTags = `<wfs:Insert><datadagger:poly><datadagger:the_geom><gml:Polygon srsName="EPSG:4087"><gml:outerBoundaryIs><gml:LinearRing><gml:coordinates>`
const insertCloseTags = `</gml:coordinates></gml:LinearRing></gml:outerBoundaryIs></gml:Polygon></datadagger:the_geom></datadagger:poly></wfs:Insert>`
