<script>
    import {ProgressRing, Checkbox, CalendarView} from "fluent-svelte";
    import { slide } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import {safeFetch} from "$lib/utils/helpers";
    import {page} from "$app/stores";

    let loading = false;
    let error = false;
    let errorMsg = '';
    let errorCount = '';

    let showDates = false;

    let name = '';
    let description = '';
    let start_date = new Date(new Date().setHours(0,0,0,0));
    let end_date = new Date(new Date(start_date).setDate(start_date.getDate() + 1));

    // Date picker safety
    $: if (start_date.getTime() >= end_date.getTime())
        end_date = new Date(new Date(start_date).setDate(start_date.getDate() + 1));
    let minStartDate = new Date(new Date(start_date).setDate(new Date().getDate() - 1));
    $: endMinDate = new Date(start_date).setDate(start_date.getDate()+1);

    const handleSubmit = async () => {
        const start = new Date();
        loading = true;

        const body = {
            name,
            description,
            status: "undefined", // TODO: define project status. Do we need it here?
            type: "undefined", // TODO: define project types
            organization_id: $page.data.organization.id,
            start_date: showDates ? start_date.getTime() : null,
            end_date: showDates ? end_date.getTime() : null
        }

        console.log(body);

        let data;
        let response;
        try {
            response = await safeFetch('/projects', body, 'POST');
            data = await response.json();
        } catch (err) {
            response = {ok: false}
            data = { message: 'An unknown error occurred' }
        }
        if (!response.ok) {
            error = true;
            errorMsg = data.message;
            errorCount = 10;
            setInterval(() => {
                if (errorCount > 0) errorCount--;
                else window.location.reload();
            }, 1000);
            return;
        }

        const end = new Date();
        setTimeout(() => {
            goto('../projects');
        }, 1000 - (end.getTime() - start.getTime()));

    }

    const handleReset = () => {
        name = '';
        description = '';
        start_date = new Date();
        end_date = new Date(new Date().setDate(start_date.getDate()+1));
    }

</script>

<div class="form-wrapper">
    <form on:submit|preventDefault={handleSubmit}>
        <h1>Invite Members</h1>

        <div class="input-wrapper">
            <div >Project Name</div>
            <input name="name" type="text" placeholder="Project Name" bind:value={name}>

            <div>Project Description</div>
            <input name="description" class="input-long" type="text" placeholder="Project Description" bind:value={description}>

            <div>Set start/end</div>
            <div class="checkbox">
                <Checkbox name="include-dates" type="checkbox" bind:checked={showDates}/>
            </div>

            {#if showDates}
                <div class="dates-wrapper" transition:slide>
                    <div class="date-inner-wrapper">
                        <div >Start Date</div>
                        <div >{start_date ? start_date.toLocaleDateString() : "unset"}</div>
                        <div>
                            <CalendarView min={minStartDate} bind:value={start_date}/>
                        </div>
                    </div>
                    <div class="date-inner-wrapper">
                        <div>End Date</div>
                        <div>{end_date ? end_date.toLocaleDateString() : "unset"}</div>
                        <div >
                            <CalendarView min={endMinDate} bind:value={end_date}/>
                        </div>
                    </div>
                </div>
            {/if}

            <div class="flex-box">
                <button class="btn" type="reset" on:click|preventDefault={handleReset}>Reset</button>
                <button class="btn" type="submit">Submit</button>
            </div>

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

    .form-wrapper, form {
        display: flex;
        flex-direction: column;
        border: 2px black;
        justify-content: space-evenly;
        position: relative;
    }

    .input-wrapper {
        width: 100%;
        display: grid;
        grid-template-columns: 20% auto;
        align-items: center;
    }

    .checkbox {
        display: flex;
        margin-left: 10px;
    }

    .dates-wrapper {
        grid-column: 2;
        display: flex;
        justify-content: space-evenly;
    }

    .date-inner-wrapper {
        text-align: center;
    }

    ::-webkit-calendar-picker-indicator {
        filter: invert(1);
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

    .flex-box {
        display: flex;
        grid-column: 2;
    }

</style>
