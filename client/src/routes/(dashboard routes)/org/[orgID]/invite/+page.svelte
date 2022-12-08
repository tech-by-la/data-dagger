<script lang="ts">
    import { page } from "$app/stores";

    import {IconButton, ProgressRing} from "fluent-svelte";
    import FaPlus from "svelte-icons/fa/FaPlus.svelte";
    import FaMinus from "svelte-icons/fa/FaMinus.svelte";
    import {PUBLIC_API_URL} from "$env/static/public";
    import {safeFetch} from "$lib/utils/helpers";

    let error = false;
    let errorMsg = '';
    let errorCount = 10;

    let loading = false;
    let emails = [''];

    const handleAddInput = () => setTimeout(() => emails = [...emails, '']);
    const handleRemoveInput = (index:number) => { emails.splice(index, 1); emails = emails};
    const handleReset = () => emails = [''];
    const focus = e => e.focus();

    const handleSubmit = async () => {
        if (emails.includes('')) return;

        const start = new Date();
        loading = true;

        const body = { org_id: $page.data.organization.data.id, emails }
        const response = await safeFetch(PUBLIC_API_URL + '/auth/invite', body, 'POST');

        const data = await response.json().catch();
        if (!response.ok) {
            error = true;
            errorMsg = data.message;
            errorCount = 10;
            setInterval(() => {
                if (errorCount > 0) errorCount--;
                // else window.location.reload()
            }, 1000);
            return;
        }

        if (response.ok) {
            console.log(data);
            const end = new Date();
            setTimeout(() => {
                emails = [''];
                loading = false;
            }, 1000 - (end.getTime() - start.getTime()));
        }
    }
</script>

<div class="form-wrapper">
    <form on:submit|preventDefault={handleSubmit}>
        <h1>Invite Members</h1>

        {#each emails as email, index}

            <div class="input-wrapper">
                <IconButton type="reset" on:click={() => handleRemoveInput(index)}>
                    <div class="minus-icon"><FaMinus /></div>
                </IconButton>
                <input class="input-name" type="email" placeholder="E-mail address" bind:value={email}  use:focus>
            </div>
        {/each}

        <IconButton type="reset" on:click={handleAddInput}>
            <FaPlus/>
        </IconButton>

        <div class="input-wrapper">
            <button class="btn" type="reset" on:click={handleReset}>Reset</button>
            <button class="btn" type="submit">Submit</button>
        </div>
    </form>

    {#if loading}
        <div class="loading-wrapper">

            {#if error}
                <div class="error-wrapper">
                    <h1>Error!</h1>
                    <h2>{errorMsg}</h2>
                    <h1>Reloading page in {errorCount} seconds!</h1>
                </div>
            {:else}
                <ProgressRing size={60}/>
            {/if}
        </div>
    {/if}
</div>

<style>
    .error-wrapper {
        color: #c40606;
        text-align: center;
    }

    .loading-wrapper {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: -10px;
        bottom: -10px;
        left: -10px;
        right: -10px;
        background-color: #000000B3;
    }

    .minus-icon {
        color: #c40606
    }

    .form-wrapper, form {
        display: flex;
        flex-direction: column;
        border: 2px;
        border-color: black;
        justify-content: space-evenly;
        position: relative;
    }
    .input-wrapper {
        width: 100%;
        display: flex;
    }


    input, .btn{
        font-size: 15px;
        line-height: 20px;
        padding: 10px;

        font-family: 'Oswald';
        font-weight: normal;
        font-style: normal;
        font-variant: normal;
        text-transform: none;

        display: inline-block;
        color: rgb(255, 255, 255);

    }

    input {
        background:#1e184453;
        margin: 5px;
        width: 100%;
        border: 2px solid #798AC5;
    }
    input:focus{
        background: #798AC5;
        outline: 3px solid #252e62;
        color: #ffffff
    }

    .btn {
        background: 0;
        margin: 5px;
        width: 50%;
        border: 3px solid #798AC5;
        border-radius: 10px;
    }

    .btn:hover {
        cursor: pointer;
        background: #798AC5;
    }

    .btn:active {
        background: #144E75;
    }
    h1 {
        text-align: center;
        margin-top: 0;

    }

</style>
