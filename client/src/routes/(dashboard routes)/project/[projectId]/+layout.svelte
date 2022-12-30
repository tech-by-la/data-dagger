<script lang="ts">
	
  import Container from '$lib/Components/Container.svelte';
  import { page } from '$app/stores';
	import GoBackBtn from '$lib/Components/GoBackBtn.svelte';
  import { fly, slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
	import DashboardHeader from '$lib/Components/DashboardHeader.svelte';

    const { user, project, org} = $page.data
    
</script>

<div class="proj-page-wrapper" in:fly="{{delay: 500, duration: 500, x: -2000, y: 0, opacity: 0.5}}" out:slide="{{delay: 0, duration: 500}}">
  

  <Container>
    <div class="top-panel">

      <div class="user-info">
        <div class="user">
          <b>User:</b> {user.email} 
        </div>
        {#if org.name}
        <div class="org" transition:fly="{{delay: 0, duration: 500, x: -500, y: 0, opacity: 0.5, easing:quintOut}}" >
          <b>Organization:</b> {org.name}
        </div>
        {/if}
        {#if project.id}
        <div class="project" transition:fly="{{delay: 500, duration: 500, x: -500, y: 0, opacity: 0.5}}">
          <b>Project:</b> {project.name}
        </div>
        {/if}
        
      </div>

      <div class="title">
        <h1> -  Project Dashboard - </h1>
      </div>

      <div class="back-div">
        <GoBackBtn url ="/org/{org.id}"></GoBackBtn>
      </div>

    </div>
  </Container>

  <slot></slot>
</div>
<style>
  .top-panel {
    display: flex;
    justify-content: space-around;
    height: 30px;
  }
  .title {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: center;
    font-size: 15px;

    }
  .back-div{
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: right;
    font-size: 15px;
    width: 50%;
    padding: 5px;
  }
  .user-info {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: left;
    
  }
  .user-info div{
    padding-right: 10px;
  }
</style>
