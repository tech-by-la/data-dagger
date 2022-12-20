<script lang="ts">
    import {IconButton, ProgressRing} from "fluent-svelte";
    import FaPlus from "svelte-icons/fa/FaPlus.svelte";
    import FaMinus from "svelte-icons/fa/FaMinus.svelte";
    import { slide } from 'svelte/transition';
    import {page} from "$app/stores";

    let nextId = 0;

    let loading = false;
    let selector = [{id: nextId++, email: '', error: null}];
    $: emails = selector.map(s => s.email);

    let response;
    if ($page.form) response = $page.form.response;

    if (response && response.invalid) {
        selector = [...response.invalid.map(i => { return {id: nextId++, email: i, error: 'invalid'} })];
    }

    const handleAddInput = () => setTimeout(() => selector = [...selector, {id: nextId++, email: '', error: null}]);
    const handleRemoveInput = (index:number) => { selector.splice(index, 1); selector = selector};
    const handleReset = () => selector = [{id: nextId++, email: '', error: null}];
    const focus = (e: HTMLInputElement) => e.focus();
</script>

<div class="form-wrapper">

    <h1>Invite Members</h1>

    {#each selector as email, index (email.id)}
        <div transition:slide|local>

            <div class="input-wrapper">
                <IconButton on:click={() => handleRemoveInput(index)}>
                    <div class="minus-icon"><FaMinus /></div>
                </IconButton>
                <input class="input-name" type="email" placeholder="E-mail address" bind:value={email.email}  use:focus>
            </div>
            {#if email.error === 'invalid'}
                <div class="error">Invalid email</div>
            {/if}
        </div>
    {/each}

    <IconButton on:click={handleAddInput}>
        <FaPlus/>
    </IconButton>

    <form method="post">
        <div class="input-wrapper">
                <input name="emails" type="hidden" bind:value={emails}>
                <button class="btn" type="reset" on:click={handleReset}>Reset</button>
                <button class="btn" type="submit" on:click={() => loading = true}>Submit</button>
        </div>
    </form>

    {#if loading}
        <div class="loading-wrapper">
            <ProgressRing size={60}/>
        </div>
    {/if}
</div>

<style>
    .loading-wrapper {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
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

    .error {
        margin: 0 0 20px 40px;
        color: red;
    }

</style>
