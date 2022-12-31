<script lang="ts">
    import { Map, View } from "ol";
    import OSM from "ol/source/OSM";
    import proj4 from 'proj4';
    import {register} from 'ol/proj/proj4';
    import {get as getProjection} from 'ol/proj';
    import TileLayer from "ol/layer/Tile";
    import { onMount } from "svelte";
	import ImageLayer from "ol/layer/Image";
    import ImageWMS from 'ol/source/ImageWMS';

    export let map;
    // Setting a danish projecyion
    const mapSrs = "EPSG:25832"
    proj4.defs(mapSrs,"+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
    register(proj4);
    const dkProjection = getProjection(mapSrs);

    // Map setup variables
    var ortofoto = new ImageLayer({
      source: new ImageWMS({
        url: 'https://services.datafordeler.dk/GeoDanmarkOrto/orto_foraar/1.0.0/Wms?servicename=orto_foraar&username=CAVCEPWVSC&password=JOB2020adgang!',
        params: {
            LAYERS: 'orto_foraar_12_5',
            TRANSPARENT: "TRUE",
            FORMAT: 'image/jpeg',
        }
      })
    });
    const target = "map";
    let x = 607933;
    let y = 6189255;
    let view = new View({ center: [x, y], projection: <any> dkProjection, zoom: 7 });
    let osmMapLayer = new TileLayer({ source: new OSM() });
    // let layers = [osmMapLayer, ortofoto];
    let layers = [osmMapLayer];

    onMount( () => {
        map = new Map({
        layers: layers,
        target: target,
        view: view,
        controls: []
        });
    });
</script>

<div id="map"><slot/></div>

<style>
    #map {
        position: relative;
        margin: 0px;
        border: 0px;
        width: 100%;
        height: 100%;
    }

</style>
