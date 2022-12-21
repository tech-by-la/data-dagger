<script lang="ts">
    import { page } from '$app/stores';
    import {Button} from "fluent-svelte";
    import { goto } from '$app/navigation';

    const { projects } = $page.data;
    console.log(projects);
</script>

<h1>This will be a list of projects</h1>

{#each projects as project}
    <Button on:click={() => goto(`/project/${project.id}`)}>{project.name}</Button>
{/each}
