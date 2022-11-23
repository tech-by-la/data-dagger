<script>
import {fly, fade} from 'svelte/transition'

/**
	 * @type {any}
	 */
     export let toggle;
</script>

<div class="prompt-div">
    <div class="shader" transition:fade on:click={toggle} on:keypress={toggle}/>
    <div class="prompt-box" transition:fly={{y: -500}}>
        <slot></slot>
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
        padding: 15px;
        background-color: #283871;
        border-radius: 20px;
        border: solid 5px white;
        z-index: 3;
    }

</style>
