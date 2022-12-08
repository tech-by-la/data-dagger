<script lang="ts">
    import { page } from '$app/stores';
    import {fade} from 'svelte/transition';
    import Square from 'svelte-icons/fa/FaRegSquare.svelte';
    import CheckSquare from 'svelte-icons/fa/FaCheckSquare.svelte';
    import Trash from 'svelte-icons/fa/FaTrash.svelte';
    import {Button, IconButton, ProgressRing} from "fluent-svelte";

    import {safeFetch} from "$lib/utils/helpers";

    const invites = $page.data.invites.data;

    let selected = [];
    $: allSelected = invites.length > 0 && selected.length === invites.length;

    let promptOpen = false;
    let hover = false;
    let loading = false;

    let deleteOne = '';

    const handleSubmit = async () => {
        const emailsToUninvite = deleteOne ? [deleteOne] : selected.map(s => s.email);
        if (emailsToUninvite.length < 1) return;

        loading = true;
        const start = new Date().getTime();

        const body = { org_id: $page.data.org_id, emails: emailsToUninvite }
        const response = await safeFetch('/auth/invite', body, 'DELETE');

        setTimeout(() => {
            if (response.ok) window.location.reload();
            else {
                promptOpen = false;
                loading = false;
            }
        }, 666 - (new Date().getTime() - start));
    }

    const handleClickInvite = (invite) => {
        selected = selected.includes(invite)
            ? selected.filter(s => s !== invite)
            : selected = [...selected, invite];
    }

    const handleSelectAll = () => {
        selected = selected.length === invites.length
            ? []
            : invites
    }

    const handlePrompt = (email = '') => {
        deleteOne = promptOpen ? deleteOne = '' : deleteOne = email
        promptOpen = !promptOpen;
    }

</script>

<div class="content">
    {#if invites.length < 1}
        <h2 class="grid-full">No pending invites</h2>
    {:else}

        <!--  Header  -->
        <div class="list-icon grid-left" on:click={handleSelectAll}>
            {#if allSelected}
                <CheckSquare/>
            {:else}
                <Square/>
            {/if}

        </div>
        <div class="grid-left-center">Email</div>
        <div class="grid-right-center">Invited at</div>

        <!--  Delete All Button  -->
        {#if selected.length > 0}
            <div class="grid-right" style="padding-right: 2px;" on:click={() => handlePrompt()}>
                <IconButton
                    variant="accent"
                    style="background-color: {hover ? '#c30000' : 'red'}; color: white; font-weight: bold; position: absolute; cursor: pointer;"
                    on:mouseenter={() => hover = true}
                    on:mouseleave={() => hover = false}
                >
                    <Trash/>
                </IconButton>
            </div>
        {/if}

        <div class="line grid-full"></div>
    {/if}

    <!--  List of Invites  -->
    {#each invites as invite, index}
        <div class="grid-row">

            <!--  Dynamic Check Icon  -->
            <div class="grid-left {selected.includes(invite) ? 'selected' : ''}" on:click={() => handleClickInvite(invite, index)}>
                <div class="list-icon" >
                    {#if selected.includes(invite)}
                            <CheckSquare/>
                    {:else}
                            <Square/>
                    {/if}
                </div>
            </div>

            <div class="invite-email grid-left-center {selected.includes(invite) ? 'selected' : ''}">{invite.email}</div>
            <div class="invite-date grid-right-center {selected.includes(invite) ? 'selected' : ''}">{invite.sent_at}</div>
            <div class="grid-right {selected.includes(invite) ? 'selected' : ''}" on:click={() => handlePrompt(invite.email)}>
                <div class="list-icon"><Trash/></div>
            </div>
        </div>

    {/each}
</div>

{#if promptOpen}
    <span class="confirmation-background" on:click={() => promptOpen = false} transition:fade={{duration: 200}}></span>

    {#if loading}
        <div class="loading-spinner"><ProgressRing size={50}/></div>
    {:else}
        <div class="confirmation-wrapper" transition:fade={{duration: 200}}>
            <h3>Confirm Uninvite {deleteOne ? deleteOne : allSelected ? "All" : "Selected"}</h3>
            <div class="flex-row">
                <Button style="cursor: pointer;" on:click={() => promptOpen = false}>Cancel</Button>
                <Button
                    variant="accent"
                    style="background-color: {hover ? '#c30000' : 'red'}; color: white; font-weight: bold; cursor: pointer;"
                    on:mouseenter={() => hover = true}
                    on:mouseleave={() => hover = false}
                    on:click={handleSubmit}
                >
                    Delete
                </Button>
            </div>
        </div>
    {/if}
{/if}

<style>
    .content {
        display: grid;
        grid-template-columns: 30px auto auto  40px;
    }

    .grid-row {
        display: contents;
    }

    .grid-row:hover div {
        background-color: #394c8f;
    }

    .grid-left {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 44px;
        grid-column: 1;
    }

    .grid-left:hover {
        cursor: pointer;
    }

    .grid-left-center {
        grid-column: 2;
        padding: 10px;
    }
    .grid-right-center {
        grid-column: 3;
        padding: 10px;
    }
    .grid-right {
        grid-column: 4;
        padding: 10px;
        display: flex;
        justify-content: flex-end;
    }

    .grid-right:hover {
        cursor: pointer;
    }

    .grid-full {
        grid-column: 1 / span 4;
        padding: 10px;
    }

    .selected {
        background-color: #394c8f;
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
