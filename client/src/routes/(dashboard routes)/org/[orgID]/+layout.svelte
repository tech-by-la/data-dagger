<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from '$app/navigation';
    import Button from '$lib/Components/Button.svelte';
    import Container from "$lib/Components/Container.svelte";
	import { IconButton } from "fluent-svelte";
	import FaPlus from "svelte-icons/fa/FaPlus.svelte";

    const { organization, isMod, isOwner, user, projects} = $page.data;
    const hasAccess = isOwner || isMod;

    const formatDate = (unix: number) => {
        let date = new Date(unix);
        if (!unix || isNaN(date.getTime())) return 'Not set';
        return date.toLocaleDateString();
    }

</script>



<div class="org-page-wrapper">
  <Container>
    <div class="top-panel">
      <div class="user-info">
        Logged in as {user.email}
      </div>
  
      <div class="title">
        <h1>{organization.name}</h1>
  
      </div>
    </div>
  </Container>
    
  <Container>
    {#if hasAccess}
      <Button
          btnClick={() => goto(`/org/${organization.id}/members`)}
          btnTitle="Members"
          width="100%"
          active={$page.url.pathname.endsWith(`/org/${organization.id}/members`)}
      />
      <Button
          btnClick={() => goto(`/org/${organization.id}/invite`)}
          btnTitle="Invite Members"
          width="100%"
          active={$page.url.pathname.endsWith(`/org/${organization.id}/invite`)}
      />
      <Button
          btnClick={() => goto(`/org/${organization.id}/invite/pending`)}
          btnTitle="Pending Invites"
          width="100%"
          active={$page.url.pathname.endsWith(`/org/${organization.id}/invite/pending`)}
      />
    {/if}
    <Button
        btnClick={() => goto(`/org/${organization.id}/projects`)}
        btnTitle="Projects"
        width="100%"
        active={$page.url.pathname.endsWith(`/org/${organization.id}/projects`)}
    />
  </Container>
  <Container>
  <div class="projects-div">
    <h1 class="grid-full">Projects for {organization.name}</h1>

    <div class="add-button">
        <IconButton
            on:click={() => goto('projects/create')}
            style="cursor: pointer"
        >
            <FaPlus/>
        </IconButton>
    </div>

    {#if projects.length < 1}
        <h2 class="grid-full">No projects to show</h2>
    {:else}
        <div class="grid-1">
          <h2>Name</h2>
        </div>
        <div class="grid-2">
         <h2>Description</h2> 
        </div>
        <div class="grid-3">
         <h2>Status</h2>
        </div>
        <div class="grid-4">Type</div>
        <div class="line grid-full"></div>
    {/if}

    {#each projects as project, index}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="grid-row" on:click={() => goto(`/project/${project.id}`)}>
            <div class="grid-cell grid-1">{project.name}</div>
            <div class="grid-cell grid-2">{project.description}</div>
            <div class="grid-cell grid-3">{project.status}</div>
            <div class="grid-cell grid-4">{project.type}</div>
        </div>

    {/each}
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
    flex: 2;
    justify-content: center;
    font-size: 15px;

    }
    .projects-div {
        position: relative;
        display: grid;
        grid-template-columns: auto auto auto auto auto auto;
    }
    .grid-row {
        display: contents;
    }

    .grid-row:hover div {
        cursor: pointer;
        background-color: #394c8f;
    }

    .grid-cell {
        padding: 10px 0;
    }

    .grid-1 {
        grid-column: 1;
        padding-left: 10px
    }
    .grid-2 {
        grid-column: 2;
    }
    .grid-3 {
        grid-column: 3;
    }
    .grid-4 {
        grid-column: 4;
    }
    .grid-5 {
        grid-column: 5;
    }
    .grid-6 {
        grid-column: 6;
    }

    .grid-full {
        grid-column: 1 / span 6;
        padding: 10px;
    }
    .line {
        height: 1px;
        width: 100%;
        background-color: white;
        margin-top: 10px;
        padding: 0;
    }

</style>
