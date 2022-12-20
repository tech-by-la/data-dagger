<script>
    import "fluent-svelte/theme.css";
    import Navbar from "$lib/Components/Navbar.svelte";
    import Footer from "$lib/Components/Footer.svelte"
    import background from "$lib/assets/img/back.jpg"
    import "@fontsource/oswald";
    import Transition from "$lib/Components/Transition.svelte";
    import { page } from '$app/stores'
    import { onMount } from 'svelte';

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
        font-family: 'Oswald';
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


