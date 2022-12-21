<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from "$app/navigation";
    import {Checkbox, Flyout, IconButton, InfoBadge, ProgressRing} from "fluent-svelte";
    import FaChevronDown from 'svelte-icons/fa/FaChevronDown.svelte';
    import FaChevronLeft from 'svelte-icons/fa/FaChevronLeft.svelte';

    const { organizations } = $page.data;

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
        <h1>Organizations</h1>
        <span></span>
    </div>
    <table>
        <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Contact email</th>
            <th>Contact phone</th>
            <th>Created at</th>
            <th class="enabled">Enabled</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        {#each organizations as org, index}
            <tr>
                <td>{org.id}</td>
                <td>{org.name}</td>
                <td>{org.contact_email}</td>
                <td>{org.contact_phone}</td>
                <td>{new Date(org.created_at).toLocaleString('ja').split(' ')[0]}</td>
                <td class="enabled">
                    {#if disableIndex === index}
                        <ProgressRing />
                    {:else }
                        <InfoBadge severity={org.enabled ? "success" : "critical"}/>
                    {/if}
                </td>
                <td>
                    <Flyout placement="bottom" alignment="end">
                        <IconButton><FaChevronDown/></IconButton>
                        <svelte:fragment slot="flyout">
                            <div>

                                <!-- ENABLE / DISABLE USER -->
                                <form method="post">
                                    <input name="org_id" type="hidden" value={org.id}>
                                    <input name="enabled" type="hidden" value={!org.enabled}>
                                    <Checkbox
                                            on:click={() => handleSetEnabled(index)}
                                            onchange="this.form.submit()"
                                            checked={org.enabled}
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

