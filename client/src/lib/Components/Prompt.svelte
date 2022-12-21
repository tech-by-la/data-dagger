<script>
    import {fly, fade} from 'svelte/transition'
    import { page } from "$app/stores";
    import Container from './Container.svelte';
    /**
	 * @type {any}
	 */
     export let toggle;
</script>

<div class="prompt-div">
    <div class="shader" transition:fade on:click={toggle} on:keypress={toggle}/>
    
    <div class="prompt-box" transition:fly={{y: -500, duration: 500}}>
        <Container>
            <slot></slot>
        </Container>
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
        height: 100%;
        width: 100%;
        background-color: rgba(6, 8, 19, 0.747);
        z-index: 2;
        backdrop-filter: blur(5px);
      
      
    }
    .prompt-box {
        position: fixed;
        left: 30%;
        margin: auto auto;
        width: 40%;
        color: white;
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
