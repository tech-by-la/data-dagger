<script lang="ts">
    import { page } from '$app/stores';
    import {fade, slide} from 'svelte/transition';
    import Square from 'svelte-icons/fa/FaRegSquare.svelte';
    import CheckSquare from 'svelte-icons/fa/FaCheckSquare.svelte';
    import Trash from 'svelte-icons/fa/FaTrash.svelte';
    import {Button, IconButton, ProgressRing} from "fluent-svelte";
    import Line from "$lib/Components/Line.svelte";
	import { goto } from '$app/navigation';
    import MdClose from 'svelte-icons/md/MdClose.svelte';
    import Btn from '$lib/Components/Button.svelte';

    const { invites, colors, organization } = $page.data;

    let selected: string[] = [];
    $: allSelected = invites.length > 0 && selected.length === invites.length;

    let promptOpen = false;
    let hover = false;
    let loading = false;
    let oneSelected = '';

    const handleClickInvite = (invite: { email: string; }) => {
        selected = selected.includes(invite.email)
            ? selected.filter(s => s !== invite.email)
            : selected = [...selected, invite.email];
    }

    const handleSelectAll = () => {
        selected = selected.length === invites.length
            ? []
            : invites.map((i: { email: string; }) => i.email);
    }

    const handleTrash = (email: string) => {
        oneSelected = email;
        promptOpen = true;
    }

    const handleClosePrompt = () => {
        oneSelected = '';
        promptOpen = false;
    }
</script>
 <div class="pending-div" in:slide="{{delay: 500, duration: 500}}" out:slide="{{delay: 0, duration: 500}}">
    <Btn 
        btnClick= {() => goto(`/org/${organization.id}`)} 
        btnTitle="" 
        width = "50px"
        colorLight={colors.yellowLight} 
        colorMedium={colors.yellowMedium} 
        colorDark={colors.yellowDark}
        >
            <div class="icon">
                <MdClose/>
            </div>
    </Btn>
    <h1>Pending Invites</h1>
    

    <div class="content">
        {#if invites.length < 1}
            <h2 class="grid-full">No pending invites</h2>
        {:else}
    
            <!--  Header  -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
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
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="grid-right" style="padding-right: 2px;" on:click={ () => promptOpen = !promptOpen}>
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
    
            
        {/if}
        <div class="grid-full">
            <Line color={colors.yellowLight}/>
        </div>
        
        <!--  List of Invites  -->
        {#each invites as invite, index}
        
            <div class="grid-row">
    
                <!--  Dynamic Check Icon  -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="grid-left {selected.includes(invite.email) ? 'selected' : ''}" on:click={() => handleClickInvite(invite)}>
                    <div class="list-icon" >
                        {#if selected.includes(invite.email)}
                                <CheckSquare/>
                        {:else}
                                <Square/>
                        {/if}
                    </div>
                </div>
    
                <div class="invite-email grid-left-center {selected.includes(invite.email) ? 'selected' : ''}">
                    {invite.email}
                </div>
                <div class="invite-date grid-right-center {selected.includes(invite.email) ? 'selected' : ''}">
                    {invite.sent_at.toLocaleDateString()}
                </div>
    
                <!--  Trash Icon  -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="grid-right {selected.includes(invite.email) ? 'selected' : ''}" on:click={() => handleTrash(invite.email)}>
                    <div class="list-icon"><Trash/></div>
                </div>
            </div>
            <div class="grid-full">
                <Line color={colors.yellowlight}/>
            </div>
    
        {/each}
    </div>
    
    {#if promptOpen}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class="confirmation-background" on:click={handleClosePrompt} transition:fade={{duration: 200}}></span>
    
        {#if loading}
            <div class="loading-spinner"><ProgressRing size={50}/></div>
        {:else}
            <div class="confirmation-wrapper" transition:fade={{duration: 200}}>
                <h3>Confirm Uninvite {allSelected ? "All" : "Selected"}</h3>
                <div class="flex-row">
                    <Button style="cursor: pointer;" on:click={handleClosePrompt}>Cancel</Button>
                    <form method="post" on:submit>
                        <Button
                            variant="accent"
                            type="submit"
                            style="background-color: {hover ? '#c30000' : 'red'}; color: white; font-weight: bold; cursor: pointer;"
                            on:mouseenter={() => hover = true}
                            on:mouseleave={() => hover = false}
                            on:click={() => loading = true}
                        >
                            Delete
                        </Button>
                        {#if oneSelected}
                            <input name="selected" type="hidden" bind:value={oneSelected}>
                        {:else}
                            <input name="selected" type="hidden" bind:value={selected}>
                        {/if}
                    </form>
                </div>
            </div>
        {/if}
    {/if}
 </div>


<style>
    h1 {
        text-align: center;
    }

    .content {
        display: grid;
        grid-template-columns: 30px auto auto  40px;
    }

    .grid-row {
        display: contents;
    }

    .grid-row:hover div {
        background-color: var(--yellowMediumTransparent);
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
        position: fixed;
        background-color: rgba(0, 0, 0, 0.5);
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }

    .loading-spinner {
        position: absolute;
        top: calc(50% - 25px);
        left: calc(50% - 25px);
    }

</style>
