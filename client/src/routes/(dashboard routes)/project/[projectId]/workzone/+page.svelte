<script lang="ts">
    import {onMount} from "svelte";
    import { fade } from "svelte/transition";
    import { page } from '$app/stores';
    import {beforeNavigate} from "$app/navigation";
    import {ProgressRing} from "fluent-svelte";

    import {Draw, Modify, Snap} from "ol/interaction";
    import {defaults} from "ol/interaction/defaults";
    import VectorSource from "ol/source/Vector";
    import VectorLayer from "ol/layer/Vector";
    import GeoJSON from "ol/format/GeoJSON";
    import {Fill, Stroke, Style, Text} from 'ol/style';
    import {Map, View} from "ol";

    import MapCom from '$lib/Components/MapCom.svelte';
    import Button from "$lib/Components/Button.svelte";

    enum DrawAction {
        ADD = "Draw Comment",
        RESET = "Stop Drawing"
    }

    const { user, nextFeature, project, org } = $page.data;

    const org_name = org.name.replaceAll(/[^\w ]/g, '').replaceAll(' ', '').toLowerCase();
    const proj_name = project.name.replaceAll(/[^\w ]/g, '').replaceAll(' ', '').toLowerCase();
    const org_proj = `${org_name}_${proj_name}`;

    let drawings = [];
    let comments = [];
    let showCommentBox = false;

    $: json = JSON.stringify(drawings);

    const getCommentStyle = (feature) => {
        return new Style({
            stroke: new Stroke({
                width: 2,
                color: '#c40606',
            }),
            fill: new Fill({color: '#C4060633'}),
            text: new Text({
                text: feature.get('index').toString(),
                textAlign: 'center',
                textBaseline: 'middle',
                font: 'Bold 16px sans-serif',
                stroke: new Stroke({color: 'white'}),
                fill: new Fill({color: 'black'}),
            })
        });
    }

    const feature = new GeoJSON().readFeature(nextFeature);
    const featureSource = new VectorSource({ features: [feature] });
    const featureLayer = new VectorLayer({
        source: featureSource,
        style: {
            'stroke-width': 4,
            'stroke-color': '#798AC580',
            'fill-color': 'transparent',
        },
    });

    const commentSource = new VectorSource({ features: [] });
    const commentLayer = new VectorLayer({ source: commentSource });

    let map: Map;
    let modify = new Modify({ source: featureSource });
    let loading = false;
    let drawInteraction = DrawAction.ADD;

    let activeIndex = -1;
    let editIndex = null;

    onMount(async () => {
        map.addLayer(featureLayer);
        map.addLayer(commentLayer);
        resetMapView();
    });

    // unlock feature
    beforeNavigate(() => fetch(`/api/features/unlock/${nextFeature.id}`));

    const resetMapView = () => {
        const coordinates = nextFeature.geometry.coordinates[0];
        const x_0 = coordinates[0][0];
        const y_0 = coordinates[0][1];
        const x_2 = coordinates[2][0];
        const y_2 = coordinates[2][1];
        const x = x_0 + Math.abs(x_0 - x_2) / 2;
        const y = y_0 + Math.abs(y_0 - y_2) / 2;
        const view = new View({ center: [Math.abs(x), y], zoom: 14.8});
        map.setView(view);
    }

    let draw, snap;
    const addDrawInteraction = () => {
        toggleInteractions(false);

        draw = new Draw({
            source: commentSource,
            type: 'Polygon',
        });

        snap = new Snap({source: featureSource});
        map.addInteraction(draw);
        map.addInteraction(snap);
        map.addInteraction(modify);
        drawInteraction = DrawAction.RESET;
        draw.on('drawend', e => {
            console.log(e.feature);
            e.feature.set('index', drawings.length + 1);
            drawings.push({
                feature: e.feature,
                name: nextFeature.properties.name,
                status: 'found',
                org_proj: org_proj,
                project_id: project.id,
                description: '',
                action: '',
                reported_by: user.email,
            });
            activeIndex = drawings.length - 1;
            commentLayer.setStyle(getCommentStyle);
            showCommentBox = true;
        });
    }

    const resetInteractions = () => {
        if (draw && snap) {
            map.removeInteraction(draw);
            map.removeInteraction(snap);
            map.removeInteraction(modify);
        }
        toggleInteractions(true);
        drawInteraction = DrawAction.ADD;
    }

    const toggleInteractions = (on: boolean) => {
        let length = map.getInteractions().getLength();
        if (on) defaults().forEach(i => map.addInteraction(i));
        else for (let i = 0; i < length; i++) map.getInteractions().pop();
    }

    const handleClear = () => {
        drawings.forEach(d => commentSource.removeFeature(d.feature));
        drawings = [];
    }

    const handleSave = () => {
        if (!drawings[activeIndex].description || !drawings[activeIndex].action) return;

        if (editIndex !== null) {
            comments[editIndex].description = drawings[activeIndex].description;
            comments[editIndex].action = drawings[activeIndex].action;
            comments = comments; // update DOM
        } else {
            comments = [...comments, {
                description: drawings[activeIndex].description,
                action: drawings[activeIndex].action,
            }];
        }

        editIndex = null
        showCommentBox = false;
    }

    const handleCancel = () => {
        commentSource.removeFeature(drawings[drawings.length-1]?.feature);
        drawings.pop();
        showCommentBox = false;
    }

    const handleEdit = (index) => {
        activeIndex = index;
        editIndex = index;
        showCommentBox = true;
    }

</script>

<div class="project-page-wrapper default">
    <div class="con-1 default">
        Project con-1
    </div>
    <div class="con-2 default">
        <div class="con-2-1 default">
          <Button btnClick={drawInteraction === DrawAction.ADD ? addDrawInteraction : resetInteractions}>{drawInteraction}</Button>
          <Button btnClick={handleClear}>Clear All Comments</Button>
          <Button btnClick={resetMapView}>Reset Map View</Button>
          {#if loading}
              <div class="loading"></div>
          {/if}
        </div>
        <div class="con-2-2 default">
            <MapCom bind:map={map}></MapCom>
            {#if showCommentBox}
                <div class="comment-box default" transition:fade={{duration: 100}}>
                    <h2>Comment</h2>
                    <label for="description">Description</label>
                    <textarea name="description" class="comment input" rows="8"
                        placeholder="Please write a comment to specify the issue within the polygon you have drawn"
                        bind:value={drawings[activeIndex].description}
                    ></textarea>
                    <label for="action">Action</label>
                    <input name="action" class="action input" type="text"
                        placeholder="What should be done about this?"
                        bind:value={drawings[activeIndex].action}
                    />
                    <span>
                        <Button btnClick={handleCancel}>Cancel</Button>
                        <Button btnClick={handleSave}>Save</Button>
                    </span>
                </div>
            {/if}
            {#if loading}
              <div class="loading">
                  <ProgressRing size={60}/>
              </div>
          {/if}
        </div>
        <div class="con-2-3 default">
            <form method="post">
                <Button btnClick={() => loading = true}>OK</Button>
                <input name="status" type="hidden" value="ok">
                <input name="project_id" type="hidden" value={project.id}>
                <input name="feature_id" type="hidden" value={nextFeature.id}>
                <input name="comments" type="hidden" bind:value={json}>
            </form>
            <form method="post">
                <Button btnClick={() => loading = true}>FAIL</Button>
                <input name="status" type="hidden" value="fail">
                <input name="project_id" type="hidden" value={project.id}>
                <input name="feature_id" type="hidden" value={nextFeature.id}>
                <input name="comments" type="hidden" bind:value={json}>
            </form>
            {#if loading}
            <div class="loading"></div>
            {/if}
      </div>
    </div>
    <div class="con-3 default">
        <div class="comments-grid">
            {#if comments.length > 0}
                <h2>Comments</h2>
                <p class="comment-head">Index</p>
                <p class="comment-head">Description</p>
                <p class="comment-head">Action</p>
                <p class="comment-head"></p>
            {/if}

            {#each comments as comment, index}
                <h3>{index+1}</h3>
                <p>{comment.description}</p>
                <p>{comment.action}</p>
                <Button btnClick={() => handleEdit(index)}>Edit</Button>
            {/each}
        </div>

    </div>
</div>

{#if showCommentBox}
    <div class="overlay" transition:fade={{duration: 100}}></div>
{/if}

<style>
    .comment-head {
        font-weight: bold;
    }

    .comments-grid {
        display: grid;
        align-items: center;
        grid-template-columns: 100px auto auto 70px;
        padding: 0 20px;
    }

    .comments-grid label {
        align-self: flex-start;
    }

    .comments-grid h2 {
        grid-column: 1 / span 4;
        text-align: center;
    }

    .comment-box {
        position: absolute;
        top: calc(40% - 150px);
        left: calc(50% - 250px);
        max-height: 300px;
        width: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        background-color: #31313cF2;
        z-index: 10;
    }

    .comment-box label {
        align-self: flex-start;
    }

    .comment-box h2  {
        margin: 0;
    }

    .comment-box span {
        display: flex;
        width: 100%;
        justify-content: space-evenly;
    }

    .comment {
        width: 99%;
        resize: none;
    }

    .action {
        width: 99%;
    }

    .overlay {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #00000080;
        z-index: 9;
    }

    .default {
      border: 5px #1e18444b solid;
      padding: 10px;
      margin: 0;
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
        position: relative;
        margin-left: 0;
        flex: 1;
        height: 100px;
    }
    .con-2-2 {
        position: relative;
        flex: 4;
    }
    .con-2-3 {
        position: relative;
        margin-right: 0;
        flex:1;
    }
     .con-1 {
         position: relative;
         flex: 2;
     }
     .con-2 {
         flex: 6;
     }
     .con-3 {
         flex: 1;
     }

     .loading {
         position: absolute;
         top: 0;
         right: 0;
         left: 0;
         margin: 10px;
         z-index: 2;
         display: flex;
         justify-content: center;
         align-items: center;
     }

</style>
