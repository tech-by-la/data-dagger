<script>
    import { page } from '$app/stores';
    import {ProgressRing} from "fluent-svelte";
	import { slide } from 'svelte/transition';

    let loading = false;
</script>

<div class="form-wrapper" in:slide="{{delay: 500, duration: 500}}" out:slide="{{delay: 0, duration: 500}}">
    <form method="post">
        <h1>Create Project</h1>

        <input name="organization_id" type="hidden" value={$page.data.organization.id}>
        <div class="input-wrapper">
            <div >Project Name</div>
            <input name="name" class="input" type="text" placeholder="Project Name">

            <div>Project Description</div>
            <input name="description" class="input-long input" type="text" placeholder="Project Description">

            <div>Project Type</div>
            <select name="type" class="drop-down-box">
                <option value="GeoProject" >GeoProject</option>
            </select>
            <div class="flex-box">
                <button class="btn" type="reset" >Reset</button>
                <button class="btn" type="submit" on:submit={() => loading = true}>Submit</button>
            </div>
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

    /* input, .btn{
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

    } */

    .drop-down-box {
        font-size: 15px;
        line-height: 20px;
        padding: 8px;
        background:#1e184453;
        margin: 5px;
        border: 2px solid #798AC5;
        display: inline-block;
        color: rgb(255, 255, 255);
        font-family: 'Oswald';
        font-weight: normal;
        font-style: normal;
        font-variant: normal;
        text-transform: none;
    }
    .drop-down-box:focus{
        background: #798AC5;
        outline: 5px solid #1e1844ab;
        color: #ffffff
    }

    .btn {
        width: 50%;
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
