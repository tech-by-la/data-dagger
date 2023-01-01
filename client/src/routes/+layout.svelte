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
    height: 100%;
    position: absolute;
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
        border: 2px solid var(--greyDark);
        -webkit-text-fill-color: rgb(255, 255, 255);
        -webkit-box-shadow: 0 0 0px 1000px var(--greyMedium) inset;
        transition: background-color 5000s ease-in-out 0s;
    }
    :root {
        --purpleLight:#798AC5;
        --putpleMedium: #43448d;
        --putpleMediumTransparent: #43448d80;
        --purpleDark: #282158;

        --greyLight:#c9c9c9;
        --greyMedium: #878788;
        --greyMediumTransparent: #87878880;
        --greyDark: #464646;

        --blueLight:#79b6c5;
        --blueMedium: #43668d;
        --blueMediumTransparent: #43668d80;
        --blueDark: #214d58;

        --greenLight:#79c58c;
        --greenLightTransparent:#79c58c80;
        --greenMedium: #438d47;
        --greenMediumTransparent: #438d4780;
        --greenDark: #1a4d1f;

        --yellowLight:#c0c579;
        --yellowMedium: #828d43;
        --yellowMediumTransparent: #828d4380;
        --yellowDark: #545821;

        --redLight:#c57979;
        --redMedium: #8d4343;
        --redMediumTransparent: #8d434380;
        --redDark: #582121;

        --orangeLight:#c5a279;
        --orangeMedium: #8d6a43;
        --orangeMediumTransparent: #8d6a4380;
        --orangeDark: #583c21;

    }
    

</style>

<div class="background"></div>

<div class="wrapper">
    <main>
        <div class="navbar">
            <Navbar />
        </div>

        <div class="slot"  >
                    <slot />
        </div>

        <div class="footer">
            <Footer />
        </div>
    </main>
</div>

{#if loading}
    <div class="progress-bar" out:fade={{ delay: 500 }}><ProgressBar bind:value={$progress}/></div>
{/if}
