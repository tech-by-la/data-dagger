import type {PageServerLoad} from "./$types";


export const load: PageServerLoad = ({fetch}) => {

    // (async () => {
    //     const kmTileWfsSource = new VectorSource({
    //         format: new GeoJSON(),
    //         strategy: bboxStrategy,
    //         url: (extent) => {
    //             console.log(extent);
    //             return (
    //                 `http://localhost:9090/geoserver/datadagger/ows
    //                     ?service=WFS
    //                     &version=2.0.0
    //                     &request=GetFeature
    //                     &typeNames=poly3
    //                     &outputFormat=json
    //                     &srsname=EPSG:3857
    //                     &bbox=${extent.join(',')}EPSG:3857
    //                     &id=11
    //             `);
    //         }
    //     });
    //
    //     const kmTileWfsLayer = new VectorLayer({
    //         source: kmTileWfsSource,
    //         style: {
    //             'stroke-width': 0.75,
    //             'stroke-color': 'white',
    //             'fill-color': 'rgba(100,100,100,0.25)',
    //         },
    //     });
    //
    //     // console.log(kmTileWfsLayer);
    // })();

    // (async () => {
    //     const { features } = geojson as {[key: string]: any};
    //     const xml = geojsonToXml([features[0], features[1]])
    //     const URL = 'http://localhost:9090/geoserver/wfs';
    //
    //     const response = await fetch(URL, {
    //         method: "POST",
    //         body: xml,
    //     });
    //
    //     const data = await response.text();
    //     console.log(data);
    //
    // })


}
