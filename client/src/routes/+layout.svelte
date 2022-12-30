<script>
    import "fluent-svelte/theme.css";
    import Navbar from "$lib/Components/Navbar.svelte";
    import Footer from "$lib/Components/Footer.svelte"
    import "@fontsource/oswald/300.css";
    import Transition from "$lib/Components/Transition.svelte";
    import { page } from '$app/stores'
    import { fade, fly } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { beforeNavigate, afterNavigate } from '$app/navigation';
    import {tweened} from "svelte/motion";
    import {cubicOut} from "svelte/easing";
    import {ProgressBar} from "fluent-svelte";
    import { quintOut } from 'svelte/easing';

    let progress = tweened(0);
    let loading = false;
    let timer;
    beforeNavigate(() => {
        progress.set(0);
        timer = setTimeout(() => {
            loading = true;
            progress.set(60, { duration: 2500, easing: cubicOut })
            progress.set(90, { duration: 10000, delay: 2500 });
            progress.set(99, { duration: 30000, delay: 12500 });
        }, 200);
    });
    afterNavigate(() => {
        clearInterval(timer);
        progress.set(100, { duration: 100, easing: cubicOut })
            .then(() => {
                loading = false;
                progress.set(0);
            });
    });

    // let ready = false;
    // onMount(() => ready = true);
</script>

<style global>
    html {
        background-color: #31313c;
        background-image: url("$lib/assets/img/back.jpg");
        background-blend-mode:soft-light;
        background-size: 100% 100%;
        background-attachment: fixed;
        font-family: "Oswald", sans-serif;
        color: rgb(255, 255, 255);
    }
    main {
        margin: 0;
        display: flex;
        flex-direction: column;
        backdrop-filter: blur(5px);
        min-height: 100vh;
    }
    .slot {
        flex: 1;
    }
    .progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
    }
    .icon {
        list-style-type: none;
        height: 35px;
        margin: -8px;
    }
    .btn {
        color: rgb(255, 255, 255);
        font-size: 20px;
        line-height: 20px;
        padding: 10px;
        font-family: 'Oswald';
        font-weight: normal;
        font-style: normal;
        font-variant: normal;
        text-transform: none;
        border: 3px solid #798AC5;
        display: inline-block;
        background: 0;
        margin: 5px;
        border-radius: 15px;
    }
    .input {
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
        background:#1e1844ab;
        margin: 5px;
        width: auto;
        border: 2px solid #798AC5; 
    }
    .input:focus{
        background: #798AC5; 
        outline: 5px solid #1e1844ab;
        color: #ffffff
    }
    .btn:hover {
        cursor: pointer;
        background: #798AC5;
    }
    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus,
    textarea:-webkit-autofill,
    textarea:-webkit-autofill:hover,
    textarea:-webkit-autofill:focus,
    select:-webkit-autofill,
    select:-webkit-autofill:hover,
    select:-webkit-autofill:focus {
        border: 2px solid rgb(91, 99, 173);
        -webkit-text-fill-color: rgb(255, 255, 255);
        -webkit-box-shadow: 0 0 0px 1000px rgb(101, 103, 143) inset;
        transition: background-color 5000s ease-in-out 0s;
    }
    

</style>

<div class="background"></div>

<div class="wrapper">
    <main>
        <div class="navbar">
            <Navbar />
        </div>

        <div class="slot"  >
            <!-- {#if ready} -->
            <!-- <Transition url = {$page.url}> -->
                <!-- <div class="div"  > -->
                    <slot />
                <!-- </div> -->
                
            <!-- </Transition> -->
            <!-- {/if} -->
        </div>

        <div class="footer">
            <Footer />
        </div>
    </main>
</div>

{#if loading}
    <div class="progress-bar" out:fade={{ delay: 500 }}><ProgressBar bind:value={$progress}/></div>
{/if}
