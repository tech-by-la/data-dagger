<script>
    import { createEventDispatcher} from 'svelte';
    import {fly, fade} from 'svelte/transition'
    const dispatch = createEventDispatcher();

    function open() {
        dispatch('openPrompt');
    }
    function close() {
        dispatch('closePrompt');
    }


</script>

<div class="shader" transition:fade on:click={close}/>
<div class="prompt-box" transition:fly={{y: -500}}>
    <slot></slot>
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
        height: 200px;
        width: 30%;
        color: white;
        padding: 15px;
        background-color: #283871;
        border-radius: 20px;
        border: solid 5px white;
        z-index: 3;
    }

</style>
