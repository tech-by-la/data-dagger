<script lang="ts">

    import { page } from '$app/stores';
    import Prompt from "$lib/Components/Prompt.svelte";
    import {IconButton, Expander} from "fluent-svelte";
    import FaPlus from "svelte-icons/fa/FaPlus.svelte";
    import FaMinus from "svelte-icons/fa/FaMinus.svelte";

    let { translations } = $page.data;

    let pages = []

    $: if (translations) {
        const uniquePages = [];
        const p = []
        for (const t of translations) {
            if (!uniquePages.includes(t.page)) {
                uniquePages.push(t.page);
                p.push({name: t.page, locales: []});
            }
            p.find(p => p.name === t.page).locales.push(t);
        }
        pages = p;
    }

    let promptOpen = false;
    let disabled = false;
    let languages = ['en', 'da'];
    const defaultLocale = {locale: languages[0], translation: ''}
    let locales = [ {...defaultLocale} ];

    const handleManipulateLocales = (indexToRemove?) => {
        indexToRemove
            ? locales = locales.splice(indexToRemove, 1)
            : locales = [...locales, {...defaultLocale}];
    }

    let tlPage = '';
    let tlKey = '';
    const handleSubmit = async () => {
        const body = { page: tlPage, key: tlKey, translations: {} }
        for (const locale of locales) {
            body.translations[locale.locale] = locale.translation;
        }

        if (
            !tlPage || !tlKey ||
            locales.find(l => !l.translation) ||
            Object.keys(body.translations).length !== locales.length
        ) {
            return;
        }

        disabled = true;

        disabled = false;
    }

    const resetForm = () => {
        setTimeout(() => {
            tlPage = '';
            tlKey = '';
            locales = [{...defaultLocale}];
        }, 250);
    }
</script>

<div class="container">

    <div class="add-button">
        <IconButton on:click={() => promptOpen = !promptOpen}>
            <FaPlus/>
        </IconButton>
    </div>

    <div class="translations">
        {#each pages as page}
            <Expander>
                {page.name}
                <svelte:fragment slot="content">
                    {#each page.locales as locale}
                        <div>
                            <div class="flex-row">
                                {locale.key}
                                {locale.translations[languages[0]] || ''}
                                {locale.translations[languages[1]] || ''}
                            </div>
                        </div>
                    {/each}
                </svelte:fragment>
            </Expander>
        {/each}
    </div>

</div>

{#if promptOpen}
    <Prompt toggle={() => promptOpen = !promptOpen}>
        <div class="form-wrapper">
            <h1>Create New</h1>
            <input disabled={disabled} class="input-name" type="text" placeholder="Page" bind:value={tlPage}>
            <input disabled={disabled} class="input-name" type="text" placeholder="Key" bind:value={tlKey}>

            {#each locales as locale, index}
                <div class="locale">
                    <select disabled={disabled} on:change={e => locale.locale = e.target.value}>
                        {#each languages as language}
                            <option>{language}</option>
                        {/each}
                    </select>
                    <input disabled={disabled} class="input-name" type="text" bind:value={locale.translation}>
                    {#if index !== 0}
                        <IconButton disabled={disabled} on:click={() => handleManipulateLocales(index)}>
                            <FaMinus/>
                        </IconButton>
                    {/if}
                </div>
            {/each}

            {#if locales.length < languages.length}
                <IconButton disabled={disabled} on:click={() => handleManipulateLocales()}>
                    <FaPlus/>
                </IconButton>
            {/if}
            <button disabled={disabled} class="btn" on:click={handleSubmit}>Submit</button>
        </div>

    </Prompt>
{/if}

<style>
    .container {
        width: 100%
    }

    .add-button {
        position: absolute;
        top: 90px;
        right: 10px;
        width: fit-content;
        border: 2px solid white;
        border-radius: 8px;
    }

    .form-wrapper, form {
        display: flex;
        flex-direction: column;
        border: 2px;
        border-color: black;
        justify-content: space-evenly;
    }
    .inner-btn-div {
        display: flex;
        flex-direction: row;
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
        width: auto;
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
        background: #798AC5;
    }

    .btn:active {
        background: #144E75;
    }

    h1 {
        text-align: center;
        margin-top: 0;

    }

    .locale {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }

    select {
        height: 30px;
        margin-left: 5px;
    }

    .translations {
        margin-top: 60px;
    }

    .flex {
        display: flex;
    }
</style>
