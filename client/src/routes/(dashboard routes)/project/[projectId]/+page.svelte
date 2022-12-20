<script lang="ts">
    import type { PageData } from './$types';
    import Map from '$lib/Components/Map.svelte';
  
    export let data: PageData;
    let map: Map;
  </script>
  
  <!-- <h1>{data.post.title}</h1>
  <div>{@html data.post.content}</div> -->


  <div class="project-page-wrapper">
    <div class="con-1">Project con-1</div>
    <div class="con-2">
      <div class="con-2-1">Layer controlling con-2-1</div>
      <div class="con-2-2">
      <Map {map}></Map></div>
      <div class="con-2-3">Buttons to manipulate data  con-2-3</div>
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