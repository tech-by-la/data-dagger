<script>
    import "fluent-svelte/theme.css";
    import Navbar from "$lib/Components/Navbar.svelte";
    import Footer from "$lib/Components/Footer.svelte"
    import "@fontsource/oswald/300.css";
    import Transition from "$lib/Components/Transition.svelte";
    import { page } from '$app/stores'
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { beforeNavigate, afterNavigate } from '$app/navigation';
    import {tweened} from "svelte/motion";
    import {cubicOut} from "svelte/easing";
    import {ProgressBar} from "fluent-svelte";

    let progress = tweened(0);
    let loading = false;
    let timer;
    beforeNavigate(() => {
        timer = setTimeout(() => {
            loading = true;
            progress.set(60, { duration: 500, easing: cubicOut })
            progress.set(95, { duration: 10000, delay: 500 });
        }, 100);
    });
    afterNavigate(() => {
        clearInterval(timer);
        progress.set(100, { duration: 100, easing: cubicOut })
            .then(() => {
                loading = false;
                progress.set(0);
            });
    });

    let ready = false;
    onMount(() => ready = true);
</script>

<style global>
    html {
        background-color: #31313c;
        background-image: url("$lib/assets/img/back.jpg");
        background-blend-mode:soft-light;
        background-size: 100% 100%;
        background-attachment: fixed;
        font-family: "Oswald", sans-serif;
        /* font-weight: 400; */
        color: rgb(255, 255, 255);
        /* width: 100%; */
        /* height: 100%; */
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

</style>

<div class="background"></div>

<div class="wrapper">
    <main>
        <div class="navbar">
            <Navbar />
        </div>

        <div class="slot">
            {#if ready}
            <Transition url = {$page.url}>
                <slot />
            </Transition>
            {/if}
        </div>

        <div class="footer">
            <Footer />
        </div>
    </main>
</div>

{#if loading}
    <div class="progress-bar" out:fade={{ delay: 500 }}><ProgressBar bind:value={$progress}/></div>
{/if}
