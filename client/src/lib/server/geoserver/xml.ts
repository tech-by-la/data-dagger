import type {Feature} from "$lib/server/util/interfaces";
import {Geometries, GeoServerProps, TileStatus} from "$lib/server/util/enums";
import {GEOSERVER_HOST, POSTGIS_USER, POSTGIS_PASS} from "$env/static/private";

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
            <project_id>${project_id}</project_id>
            <id>${properties.id}</id>
            <ogc_fid>${properties.ogc_fid}</ogc_fid>
            <ogr_fid>${properties.ogr_fid}</ogr_fid>
            <name>${properties.name || properties.navn}</name>
            <status>${TileStatus.ready}</status>
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
            <wfs:Delete typeName="${GeoServerProps.Layer}">
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

export const generateWorkspaceDefinitionXML = (workspace: string) => {
    return `
        <workspace>
            <name>${workspace}</name>
        </workspace>
    `;
}

export const generateWfsSettingsXML = () => {
    return `
        <wfs>
            <id>WFSInfoImpl-4d51626d:1854b3ff29f:-7f82</id>

            <enabled>true</enabled>
            <name>WFS</name>
            <title>GeoServer Web Feature Service</title>
            <maintainer>http://geoserver.org/comm</maintainer>
            <abstrct>This is the reference implementation of WFS 1.0.0 and WFS 1.1.0, supports all WFS operations including Transaction.</abstrct>
            <accessConstraints>NONE</accessConstraints>
            <fees>NONE</fees>
            <versions>
            <org.geotools.util.Version>
                <version>1.0.0</version>
            </org.geotools.util.Version>
            <org.geotools.util.Version>
            <version>1.1.0</version>
            </org.geotools.util.Version>
            <org.geotools.util.Version>
            <version>2.0.0</version>
            </org.geotools.util.Version>
            </versions>
            <keywords>
            <string>WFS</string>
            <string>WMS</string>
            <string>GEOSERVER</string>
            </keywords>
            <metadataLink/>
            <citeCompliant>false</citeCompliant>
            <onlineResource>http://geoserver.org</onlineResource>
            <schemaBaseURL>http://schemas.opengis.net</schemaBaseURL>
            <verbose>false</verbose>
            <gml>
            <entry>
                <version>V_10</version>
            <gml>
            <srsNameStyle>XML</srsNameStyle>
            <overrideGMLAttributes>true</overrideGMLAttributes>
            </gml>
            </entry>
            <entry>
            <version>V_20</version>
            <gml>
            <srsNameStyle>URN2</srsNameStyle>
            <overrideGMLAttributes>false</overrideGMLAttributes>
            </gml>
            </entry>
            <entry>
            <version>V_11</version>
            <gml>
            <srsNameStyle>URN</srsNameStyle>
            <overrideGMLAttributes>false</overrideGMLAttributes>
            </gml>
            </entry>
            </gml>
            <serviceLevel>COMPLETE</serviceLevel>
            <maxFeatures>1000000</maxFeatures>
            <featureBounding>false</featureBounding>
            <canonicalSchemaLocation>false</canonicalSchemaLocation>
            <encodeFeatureMember>false</encodeFeatureMember>
            <hitsIgnoreMaxFeatures>false</hitsIgnoreMaxFeatures>
            <includeWFSRequestDumpFile>false</includeWFSRequestDumpFile>
            <allowGlobalQueries>true</allowGlobalQueries>
            <simpleConversionEnabled>false</simpleConversionEnabled>
        </wfs>
    `;
}

export const generateDatastoreDefinitionXML = (storeName: string) => {
    return `
        <dataStore>
          <name>${storeName}</name>
          <connectionParameters>
            <host>geoserver_db</host>
            <port>5432</port>
            <database>geodata</database>
            <user>${POSTGIS_USER}</user>
            <passwd>${POSTGIS_PASS}</passwd>
            <dbtype>postgis</dbtype>
            <schema>public</schema>
          </connectionParameters>
        </dataStore>
    `
}

export const getFeatureTypeDefinitionXML = () => {
    return `
        <featureType>
          <name>${GeoServerProps.Layer}</name>
          <nativeName>${GeoServerProps.Layer}</nativeName>
          <namespace>
            <name>${GeoServerProps.Workspace}</name>
          </namespace>
          <title>Polly</title>
          <keywords>
            <string>features</string>
          </keywords>
          <srs>EPSG:${GeoServerProps.EPSG}</srs>
          <nativeBoundingBox>
            <minx>-20037508.342789244</minx>
            <maxx>20037508.342789244</maxx>
            <miny>-20048966.1040146</miny>
            <maxy>20048966.104014594</maxy>
            <crs>EPSG:${GeoServerProps.EPSG}</crs>
          </nativeBoundingBox>
          <latLonBoundingBox>
            <minx>-20037508.342789244</minx>
            <maxx>20037508.342789244</maxx>
            <miny>-20048966.1040146</miny>
            <maxy>20048966.104014594</maxy>
            <crs>EPSG:${GeoServerProps.EPSG}</crs>
          </latLonBoundingBox>
          <projectionPolicy>FORCE_DECLARED</projectionPolicy>
          <enabled>true</enabled>
          <store class="dataStore">
            <name>EPSG:${GeoServerProps.DataStore}</name>
          </store>
          <serviceConfiguration>false</serviceConfiguration>
          <maxFeatures>0</maxFeatures>
          <numDecimals>0</numDecimals>
          <padWithZeros>false</padWithZeros>
          <forcedDecimal>false</forcedDecimal>
          <overridingServiceSRS>false</overridingServiceSRS>
          <skipNumberMatched>false</skipNumberMatched>
          <circularArcPresent>false</circularArcPresent>
          <attributes>
            <attribute>
              <name>the_geom</name>
              <minOccurs>0</minOccurs>
              <maxOccurs>1</maxOccurs>
              <nillable>false</nillable>
              <binding>org.locationtech.jts.geom.Polygon</binding>
            </attribute>
            <attribute>
              <name>project_id</name>
              <minOccurs>0</minOccurs>
              <maxOccurs>1</maxOccurs>
              <nillable>false</nillable>
              <binding>java.lang.String</binding>
            </attribute>
            <attribute>
              <name>id</name>
              <minOccurs>0</minOccurs>
              <maxOccurs>1</maxOccurs>
              <nillable>false</nillable>
              <binding>java.lang.Integer</binding>
            </attribute>
            <attribute>
              <name>ogc_fid</name>
              <minOccurs>0</minOccurs>
              <maxOccurs>1</maxOccurs>
              <nillable>true</nillable>
              <binding>java.lang.Integer</binding>
            </attribute>
            <attribute>
              <name>ogr_fid</name>
              <minOccurs>0</minOccurs>
              <maxOccurs>1</maxOccurs>
              <nillable>true</nillable>
              <binding>java.lang.Integer</binding>
            </attribute>
            <attribute>
              <name>status</name>
              <minOccurs>0</minOccurs>
              <maxOccurs>1</maxOccurs>
              <nillable>false</nillable>
              <binding>java.lang.String</binding>
            </attribute>
            <attribute>
              <name>checked_by</name>
              <minOccurs>0</minOccurs>
              <maxOccurs>1</maxOccurs>
              <nillable>true</nillable>
              <binding>java.lang.String</binding>
            </attribute>
          </attributes>
        </featureType>
    `;
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