<script lang="ts">
    import { page } from "$app/stores";
    import {goto} from "$app/navigation";
    import { enhance } from "$app/forms";
    import {Checkbox, Flyout, IconButton, InfoBadge, ProgressRing} from "fluent-svelte";
    import FaChevronLeft from 'svelte-icons/fa/FaChevronLeft.svelte';
    import FaChevronDown from 'svelte-icons/fa/FaChevronDown.svelte';

    const { projects } = $page.data;

    let disableIndex: number | undefined;
    let disabled = false;

    const handleSetEnabled = async (index: number) => {
        disabled = true;
        disableIndex = index;
    }

</script>

<style>
    .container {
        width: 100%;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    thead {
        text-align: left;
    }

    th:first-child, td:first-child {
        padding-left: 20px;
    }

    tr {
        opacity: 1;
        height: 50px;
    }

    thead > tr {
        background-color: inherit !important;
        height: 35px;
    }

    tr:nth-child(odd) {
        background-color: #ffffff12;
    }

    .enabled {
        text-align: center;
    }

    .flex-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 20px 20px 20px;
    }

</style>

<div class="container">
    <div class="flex-row">
        <IconButton on:click={() => goto('../')}><FaChevronLeft/></IconButton>
        <h1>Projects</h1>
        <span></span>
    </div>
    <table>
        <thead>
        <tr>
            <th>Name</th>
            <th>Organization</th>
            <th>Type</th>
            <th>Status</th>
            <th class="enabled">Enabled</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        {#each projects as project, index}
            <tr>
                <td>{project.name}</td>
                <td>{project.organization_name}</td>
                <td>{project.type}</td>
                <td>{project.status}</td>
                <td class="enabled">
                    {#if disableIndex === index}
                        <ProgressRing />
                    {:else }
                        <InfoBadge severity={project.enabled ? "success" : "critical"}/>
                    {/if}
                </td>
                <td>
                    <Flyout placement="bottom" alignment="end">
                        <IconButton><FaChevronDown/></IconButton>
                        <svelte:fragment slot="flyout">
                            <div>

                                <!-- ENABLE / DISABLE USER -->
                                <form method="post" use:enhance>
                                    <input name="project_id" type="hidden" value={project.id}>
                                    <input name="enabled" type="hidden" value={!project.enabled}>
                                    <Checkbox
                                            on:click={() => handleSetEnabled(index)}
                                            onchange="this.form.submit()"
                                            checked={project.enabled}
                                            disabled={disabled}
                                    >
                                        Enabled
                                    </Checkbox>
                                </form>
                            </div>
                        </svelte:fragment>
                    </Flyout>
                </td>
            </tr>

        {/each}
        </tbody>
    </table>
</div>

