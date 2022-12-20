<script>
    import {fly, fade} from 'svelte/transition'
    import { page } from "$app/stores";
    /**
	 * @type {any}
	 */
     export let toggle;
</script>

<div class="prompt-div">
    <div class="shader" transition:fade on:click={toggle} on:keypress={toggle}/>
    <div class="prompt-box" transition:fly={{y: -500}}>
        <slot></slot>
        <div class="error-wrapper">
            {#if $page.form?.invalid}
                <div class="error">
                    {$page.form?.message}
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .shader {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 2;
    }
    .prompt-box {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: auto;
        left: 40%;
        margin: auto auto;
        height: auto;
        width: 30%;
        color: white;
        padding: 20px;
        background-color: #283871;
        border: solid 5px #798AC5;
        z-index: 3;
    }

    .error-wrapper {
        display: flex;
        justify-content: center;
    }

    .error {
        color: #c40606;
    }

</style>
