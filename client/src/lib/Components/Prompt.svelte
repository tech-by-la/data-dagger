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

<div class="background" transition:fade on:click={close}/>
<div class="prompt-box" transition:fly={{y: -500}}>
    <slot></slot>
</div>

<style>
    .background {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 2;
    }
    .prompt-box {
        position: fixed;
        margin: 20vh auto;
        height: 200px;
        width: 400px;
        color: white;
        padding: 15px;
        background-color: rgb(42,42,187);
        border: solid 5px white;
        z-index: 5;
    }

</style>
