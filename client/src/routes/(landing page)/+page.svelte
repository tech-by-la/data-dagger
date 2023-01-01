<script lang="ts">
    import Button from "$lib/Components/Button.svelte";
    import Container from "$lib/Components/Container.svelte";
    import Prompt from "$lib/Components/Prompt.svelte";
    import InputForm from "$lib/Components/InputForm.svelte";
    import { page } from "$app/stores";
    import type { Map } from "ol";
    // import OSM from "ol/source/OSM";
    // import proj4 from 'proj4';
    // import {register} from 'ol/proj/proj4';
    // import {get as getProjection, Projection} from 'ol/proj';
    // import TileLayer from "ol/layer/Tile";
	// import { onMount } from "svelte";
    import MapCom from "$lib/Components/MapCom.svelte";
	// import ImageLayer from "ol/layer/Image";
    // import ImageWMS from 'ol/source/ImageWMS';
	// import VectorSource from "ol/source/Vector";
    // import GeoJSON from "ol/format/GeoJSON";
	// import VectorLayer from "ol/layer/Vector";
    // import {bbox as bboxStrategy} from 'ol/loadingstrategy';
    // import TileWMS from 'ol/source/TileWMS';
    import MdClose from 'svelte-icons/md/MdClose.svelte';
	import { fly, slide, blur } from "svelte/transition";


    const pageText = $page.data.text


    let pagePromptController = false;
    function toggleThePrompt() {
        pagePromptController ? pagePromptController=false : pagePromptController=true
    }
    function hello(){console.log("Hello");} // placeholder function

    let map: Map;

    // var serverPort = "localhost:8080";
    // var geoserverWorkspace = "qqc";
    // var geoserverWmsUrl = 'http://' + serverPort + '/geoserver/' + geoserverWorkspace + '/wms'
    // var kmTilesLayerName = "qqc_km_tiles"



    // var kmTileWmsSource = new TileWMS({
    //     url: geoserverWmsUrl,
    //     params: { 'LAYERS': geoserverWorkspace + ':' + kmTilesLayerName, 'TILED': true },
    //     serverType: 'geoserver',
    //     visible: false
    // })

    // var kmTileWmsLayer = new TileLayer({
    //     title: "1 km Tiles",
    //     source: kmTileWmsSource
    // });

    // let kmTileWfsSource = new VectorSource({
    //     format: new GeoJSON(),
    //     url: function (extent) {
    //         return ( "http://localhost:9090/geoserver/datadagger/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=poly3&outputFormat=json"
    //             // 'http://localhost:8080/geoserver/qqc/ows?service=WFS&' +
    //             // 'version=2.0.0&request=GetFeature&typename=qqc:qqc_km_tiles&' +
    //             // 'outputFormat=application/json&srsname=EPSG:25832&' +
    //             // 'bbox=' +
    //             // extent.join(',') +
    //             // ',EPSG:25832' +
    //             // "&id=" + 8000
    //         );
    //     },
    //   strategy: bboxStrategy,
    // });


// let kmTileWfsLayer = new VectorLayer({
//   source: kmTileWfsSource,
//   style: {
//     'stroke-width': 0.75,
//     'stroke-color': 'white',
//     'fill-color': 'rgba(100,100,100,0.25)',
//   },
// });

//     const addTiles = () => {
//         map.addLayer(kmTileWfsLayer)
//         console.log("Hello");

//     }
//     const addTile2 = () => {
//         map.addLayer(kmTileWmsLayer)
//         console.log("Hello");

    // }
    // onMount(()=> {
    //     map.addLayer(kmTileWfsLayer)
    // }
    //  )


</script>

{#if pagePromptController}
    <Prompt toggle={toggleThePrompt}>
        <div class="xBtn">
        <Button btnClick={toggleThePrompt} btnTitle={""}><div class="icon"><MdClose/></div></Button>
        </div>
        <InputForm formFunction="/register" formName="Register" />

    </Prompt>
{/if}

<div class="page-con" in:slide="{{delay: 500, duration: 500}}" out:blur="{{delay: 0, duration: 500}}">

    <div class="main-con">
        <Container>
            <h1>{pageText.introText}</h1>
            <p>{pageText.aboutText1}</p>
            <p>{pageText.aboutText2}</p>
            <p>{pageText.aboutText3}</p>
        </Container>

        <Container>
            <h1>{pageText.howToText1}</h1>
            <p>{pageText.howToText2}</p>
            <p>{pageText.howToText3}</p>
            <p>{pageText.howToText4}</p>
        </Container>

        <Container>
            <h1>{pageText.demoText1}</h1>
            <p>{pageText.demoText2}</p>
            <p>{pageText.demoText3}</p>
        </Container>
        <Container>
            <div class="map-con">

                <div class="map-left-panel">
                    <Button btnClick ={hello} btnTitle="Layer 1"></Button>
                    <Button btnClick ={hello} btnTitle="layer 2"></Button>
                    <Button btnClick ={hello} btnTitle="layer 3"></Button>
                    <Button btnClick ={hello} btnTitle="Next Point"></Button>
                    <Button btnClick ={hello} btnTitle="Skip Point"></Button>
                    <Button btnClick ={hello} btnTitle="Go Back"></Button>
                </div>
                 <div id="map-wraper">
                    <MapCom bind:map = {map}/>
                 </div>
                 <div class="map-right-panel">
                    <Button btnClick ={hello} btnTitle="Class 1"></Button>
                    <Button btnClick ={hello} btnTitle="Class 2"></Button>
                    <Button btnClick ={hello} btnTitle="Class 3"></Button>
                    <Button btnClick ={hello} btnTitle="Class 4"></Button>
                    <Button btnClick ={hello} btnTitle="Class 5"></Button>
                    <Button btnClick ={hello} btnTitle="Class 6"></Button>
                 </div>
            </div>
        </Container>




    </div>

    <div class="side-con">
        <Container>
            <h1>Excited?</h1>
           <p>Well then get started right away. register</p>
           <div class="button-con">
            <Button btnClick ={toggleThePrompt} btnTitle="Get Started"></Button>
            </div>
        </Container>
    </div>

</div>





<style>

    .button-con{
        margin: 10px 10px 0px 10px;
        padding: 10px;
    }
    .page-con {
        display: flex;
        flex-direction: row;
    }
    .main-con{
        flex: 2
    }
    .side-con{
        flex: 1
    }
    .button-con{
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    .map-con {
        display: flex;
        border: 5px #1e18444b solid;
        border-radius: 0px;
        margin: 10px 10px 0px 10px;
    }
    .map-right-panel, .map-left-panel {
        width: 15%;
        display: flex;
        justify-content: space-around;
        flex-direction: column;


    }
    #map-wraper {
        margin: 0px;
        border: 0;
        width: 70%;
        height: 400px;
    }
</style>



