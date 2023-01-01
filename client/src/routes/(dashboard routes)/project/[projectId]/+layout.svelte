<script lang="ts">
	import { goto } from '$app/navigation';

    import Container from '$lib/Components/Container.svelte';
    import { page } from '$app/stores';
    import { fly, slide, blur } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import Button from '$lib/Components/Button.svelte';
    import Line from "$lib/Components/Line.svelte";

    const { user, project, org, colors} = $page.data
</script>

<div class="proj-page-wrapper" in:slide="{{delay: 500, duration: 500}}" out:blur="{{delay: 0, duration: 500}}">


  <Container color={colors.redDark} color2={colors.redMediumTransparent}>
    <div class="top-panel">

      <div class="user-info">
        <div class="user">
          <b style="color: var(--greenLight)">User:</b> {user.email}
        </div>
        {#if org.name}
        <div class="org" >
          <b style="color: var(--yellowLight)">Organization:</b> {org.name}
        </div>
        {/if}
        {#if project.id}
        <div class="project">
          <b style="color: var(--redLight)">Project:</b> {project.name}
        </div>
        {/if}

      </div>

      <div class="title">
        <h1> <b style="color: var(--redLight);">-</b>  Project Dashboard <b style="color: var(--redLight);">-</b> </h1>
      </div>

      <div class="back-div">
        <div class="back-div">
        <Button 
          btnClick= {() => goto(`/org/${org.id}`)} 
          btnTitle="Back" 
          colorLight={colors.redLight} 
          colorMedium={colors.redMedium} 
          colorDark={colors.redDark}
          width="100px"
          >
        </Button>
      </div>
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
