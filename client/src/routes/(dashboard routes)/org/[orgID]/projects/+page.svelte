<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from '$app/navigation';
    import { IconButton } from "fluent-svelte";
    import FaPlus from 'svelte-icons/fa/FaPlus.svelte';

    const { organization, projects } = $page.data;

    const formatDate = (unix: number) => {
        let date = new Date(unix);
        if (isNaN(date.getTime())) return 'Not set';
        return date.toLocaleDateString();
    }
</script>


<div class="content">
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
        <div class="grid-1">Name</div>
        <div class="grid-2">Description</div>
        <div class="grid-3">Status</div>
        <div class="grid-4">Type</div>
        <div class="grid-5">Start Date</div>
        <div class="grid-6">End Date</div>

        <div class="line grid-full"></div>
    {/if}

    <!--  List of Invites  -->
    {#each projects as project, index}
        <div class="grid-row" on:click={() => goto(`/project/${project._id}`)}>
            <div class="grid-cell grid-1">{project.name}</div>
            <div class="grid-cell grid-2">{project.description}</div>
            <div class="grid-cell grid-3">{project.status}</div>
            <div class="grid-cell grid-4">{project.type}</div>
            <div class="grid-cell grid-5">{formatDate(project.start_date)}</div>
            <div class="grid-cell grid-6">{formatDate(project.end_date)}</div>
        </div>

    {/each}
</div>

<style>
    h1, h2 {
        text-align: center;
    }

    .content {
        position: relative;
        display: grid;
        grid-template-columns: auto auto auto auto auto auto;
    }

    .add-button {
        position: absolute;
        top: 0;
        right: 0;
        width: fit-content;
        border: 2px solid white;
        border-radius: 8px;
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

    .list-icon {
        display: flex;
        align-self: center;
        height: 18px;
    }

    .flex-row {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 20px;
    }

    .confirmation-wrapper {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        top: 40%;
        left: calc(50% - 125px);
        min-width: 250px;
        padding: 10px;
        background-color: #494949;
        border-radius: 8px;
    }

    .confirmation-background {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.5);
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .loading-spinner {
        position: absolute;
        top: calc(50% - 25px);
        left: calc(50% - 25px);
    }

</style>
