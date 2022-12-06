<script lang="ts">
    import type { LayoutData } from './$types';
    import Button from '$lib/Components/Button.svelte';
    import { goto } from '$app/navigation';
    
    export let data: LayoutData
</script>

<div class="user-page-wrapper">
    <div class="con-1">Logged in as {data.user.email}</div>
    <div class="con-2">
      <div class="con-2-1">
        <Button btnClick= {() => goto(`/user/${data.user.sub}/orgs`)} btnTitle="Organizations" width = "100%"></Button>
        <Button btnClick= {() => goto(`/user/${data.user.sub}/projects`)} btnTitle="Projects" width = "100%"></Button>
      </div>
      <div class="con-2-2">
        <slot></slot>
      </div>
      <!-- <div class="con-2-3">right side panel</div> -->
    </div>
    <div class="con-3">Bottom pannel</div>
  </div>

  <style>
    div {
      border: 5px #1e18444b solid; 
      padding: 10px;
      margin: 0px 10px;
    }
    .user-page-wrapper {
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
      height: 50vh;
    }
    .con-2-1 {
      margin-left: 0;
      flex: 1;
      /* height: 100px; */
    }
    .con-2-2 {
      flex: 4;
      margin-right: 0;

    }
    /* .con-2-3 {
      margin-right: 0;
      flex:1;
    } */
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