<script>
    import { page } from '$app/stores';
	import Button from '$lib/Components/Button.svelte';
	import InputField from '$lib/Components/InputField.svelte';
    import {ProgressRing} from "fluent-svelte";
	import { slide } from 'svelte/transition';
    const { colors } = $page.data;

    let loading = false;
</script>

<div class="form-wrapper" in:slide="{{delay: 500, duration: 500}}" out:slide="{{delay: 0, duration: 500}}">
    <form method="post">
        <h1>Create Project</h1>

        <input name="organization_id" type="hidden" value={$page.data.organization.id}>
        
            <InputField 
                name="name" 
                type="text" 
                placeholder="Project Name"
                colorLight={colors.yellowLight} 
                colorMedium={colors.yellowMediumTransparent} 
                colorDark={"0"}
                >
            </InputField>

            <InputField 
                name="description" 
                type="text" 
                placeholder="Project description"
                colorLight={colors.yellowLight} 
                colorMedium={colors.yellowMediumTransparent} 
                colorDark={"0"}
                >
            </InputField>

            <select name="type" class="drop-down-box">
                <option value="GeoProject" >GeoProject</option>
            </select>
        
        <div class="buttons">
            <Button 
                type="reset" 
                btnTitle="Reset"
                colorLight={colors.yellowLight} 
                colorMedium={colors.yellowMedium} 
                colorDark={colors.yellowDark}
                width="40%"
                >
            </Button>
            <Button 
                btnTitle="Create"
                btnClick={() => loading = true}
                colorLight={colors.yellowLight} 
                colorMedium={colors.yellowMedium} 
                colorDark={colors.yellowDark}
                width="40%"
                >
            </Button>
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

    form {
        display: flex;
        flex-direction: column;
        border: 2px black;
        justify-content: center;
        /* position: relative; */
    }

    .input-wrapper {
        width: 80%;
        display: flex;
        flex-direction: column;
        /* justify-content: center; */
        justify-content: space-evenly;
        align-content: center;
        
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
        background:0;
        margin: 5px;
        border: 2px solid var(--yellowLight);
        display: inline-block;
        color: rgb(255, 255, 255);
        font-family: 'Oswald';
        font-weight: normal;
        font-style: normal;
        font-variant: normal;
        text-transform: none;
    }
    .drop-down-box:focus{
        background: var(--yellowMediumTransparent);
        outline: 0;
        color: #ffffff
    }

    
    h1 {
        text-align: center;
        margin-top: 0;
    }
    .buttons {
        display: flex;
        flex-direction: row;
    }


</style>
