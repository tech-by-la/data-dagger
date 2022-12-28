<script lang="ts">
    import { page } from '$app/stores';
    import MapCom from '$lib/Components/MapCom.svelte';
    import {Map, View} from "ol";
    import {onMount} from "svelte";
    import GeoJSON from "ol/format/GeoJSON";
    import VectorSource from "ol/source/Vector";
    import VectorLayer from "ol/layer/Vector";
    import Button from "$lib/Components/Button.svelte";

    const { nextFeature, project } = $page.data;

    let map: Map;

    let feature
    let featureSource
    let kmTileWfsLayer;

    onMount(async () => {
      feature = new GeoJSON().readFeature(nextFeature);
      featureSource = new VectorSource({});
      featureSource.addFeature(feature);
      kmTileWfsLayer = new VectorLayer({
        source: featureSource,
        style: {
          'stroke-width': 4,
          'stroke-color': '#798AC580',
          'fill-color': 'transparent',

        },
      });

      map.addLayer(kmTileWfsLayer);

      const coordinates = nextFeature.geometry.coordinates[0];
      const x_0 = coordinates[0][0];
      const y_0 = coordinates[0][1];
      const x_2 = coordinates[2][0];
      const y_2 = coordinates[2][1];
      const x = x_0 + Math.abs(x_0 - x_2) / 2;
      const y = y_0 + Math.abs(y_0 - y_2) / 2;
      const view = new View({ center: [Math.abs(x), y], zoom: 14.8});
      map.setView(view);
    });

</script>

  <!-- <h1>{data.post.title}</h1>
  <div>{@html data.post.content}</div> -->


  <div class="project-page-wrapper">
    <div class="con-1">Project con-1</div>
    <div class="con-2">
      <div class="con-2-1">Layer controlling con-2-1</div>
      <div class="con-2-2">
      <MapCom bind:map={map}></MapCom></div>
      <div class="con-2-3">
        <form method="post">
          <Button btnTitle="">Ok</Button>
          <input name="status" type="hidden" value="ok">
          <input name="project_id" type="hidden" value={project.id}>
          <input name="feature_id" type="hidden" value={nextFeature.id}>
        </form>
        <form method="post">
          <Button btnTitle="">Fail</Button>
          <input name="status" type="hidden" value="fail">
          <input name="project_id" type="hidden" value={project.id}>
          <input name="feature_id" type="hidden" value={nextFeature.id}>
        </form>
      </div>
    </div>
    <div class="con-3">Bottom pannel con-3</div>
  </div>

  <style>
    div {
      border: 5px #1e18444b solid;
      padding: 10px;
      margin: 0px 0px;
    }
    .project-page-wrapper {
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
      border: 0;
    }
    .con-2  {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0;
      border: 0;
    }
    .con-2 div{
      height: 70vh;
    }
    .con-2-1 {
      margin-left: 0;
      flex: 1;
      height: 100px;
    }
    .con-2-2 {
      flex: 4;

    }
    .con-2-3 {
      margin-right: 0;
      flex:1;
    }
     .con-1 {
      flex: 2;
     }
     .con-2 {
      flex: 6;
     }
     .con-3 {
      flex: 1;
     }

  </style>
