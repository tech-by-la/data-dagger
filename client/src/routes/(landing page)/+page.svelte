<script lang="ts">
    import FillerText from "$lib/Components/FillerText.svelte"
    import Button from "$lib/Components/Button.svelte";
    import Prompt from "$lib/Components/Prompt.svelte";
    import InputForm from "$lib/Components/InputForm.svelte";
    import { page } from "$app/stores";
    import { Map, Tile, View } from "ol";
    import OSM from "ol/source/OSM";
    // import proj4 from 'proj4';
    import {register} from 'ol/proj/proj4';
    import {get as getProjection} from 'ol/proj';
    import TileLayer from "ol/layer/Tile";
	import { onMount } from "svelte";

    const pageText = $page.data.text


    let pagePromptController = false;
    function toggleThePrompt() {
        pagePromptController ? pagePromptController=false : pagePromptController=true
    }
    function hello(){console.log("Hello");} // placeholder function
   

    // let map = new Map({});
    let target = "map";
    // var mapSrs = "EPSG:25832"

    // proj4.defs(mapSrs,"+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
    // register(proj4);
    // const dkProjection = getProjection(mapSrs);
    // projection: dkProjection,

    let x = 607933;
    let y = 6189255;
    let view = new View({ center: [x, y], zoom: 7 });

    let osmMapLayer = new TileLayer({ source: new OSM() });
    let layers = [osmMapLayer];

    onMount( () => {
        let map = new Map({
        layers: layers,
        target: target,
        view: view,
        });
    });


</script>

{#if pagePromptController}
    <Prompt toggle={toggleThePrompt}>
        <InputForm formFunction="/register" formName="Register" />
        <Button btnClick={toggleThePrompt} btnTitle={"Close"}></Button>
    </Prompt>
{/if}

<div class="page-con">

    <div class="main-con">
        <div class="text-con">
            <h1>{pageText.introText}</h1>
            <p>{pageText.aboutText1}</p>
            <p>{pageText.aboutText2}</p>
            <p>{pageText.aboutText3}</p>

            
        </div>
        <div class="text-con">
            <h1>{pageText.howToText1}</h1>
            <p>{pageText.howToText2}</p>
            <p>{pageText.howToText3}</p>
            <p>{pageText.howToText4}</p>

        </div>
        <div class="text-con">
            <h1>{pageText.demoText1}</h1>
            <p>{pageText.demoText2}</p>
            <p>{pageText.demoText3}</p>
        </div>
        <div class="map-con">
            <div class="map-left-panel">
                <Button btnClick ={hello} btnTitle="Layer 1"></Button>
                <Button btnClick ={hello} btnTitle="layer 2"></Button>
                <Button btnClick ={hello} btnTitle="layer 3"></Button>
                <Button btnClick ={hello} btnTitle="Next Point"></Button>
                <Button btnClick ={hello} btnTitle="Skip Point"></Button>
                <Button btnClick ={hello} btnTitle="Go Back"></Button>
            </div>
             <div id="map"></div>
             <div class="map-right-panel">
                <Button btnClick ={hello} btnTitle="Class 1"></Button>
                <Button btnClick ={hello} btnTitle="Class 2"></Button>
                <Button btnClick ={hello} btnTitle="Class 3"></Button>
                <Button btnClick ={hello} btnTitle="Class 4"></Button>
                <Button btnClick ={hello} btnTitle="Class 5"></Button>
                <Button btnClick ={hello} btnTitle="Class 6"></Button>
             </div>
        </div>
        
        
    </div>

    <div class="side-con">
        <div class="text-con">
           <h1>Excited?</h1>
           <p>Well then get started right away. register</p>
           <div class="button-con">
            <Button btnClick ={toggleThePrompt} btnTitle="Get Started"></Button>
            </div>
        </div>
    </div>

</div>





<style>
    .text-con{
        border: 5px #1e18444b solid;
        border-radius: 0px;
        margin: 10px 10px 0px 10px;
        padding: 10px;
    }
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
    #map {
        margin: 0px;
        border: 0;
        width: 70%;
        height: 400px;
    }
</style>



