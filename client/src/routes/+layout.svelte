<script>
    import "../app.css";
    import Navbar from "$lib/Components/Navbar.svelte";
    import Footer from "$lib/Components/Footer.svelte"
    import "@fontsource/oswald";

    let isPrompt = false

    function openThePrompt() {
        isPrompt = true;
    }
    function closeThePrompt() {
        isPrompt = false;
    }
</script>



<main>
    <Navbar/>
    
    <slot/>
</main>


<style>
    main {
        background: #283871;
        font-family: 'Oswald';
        color: rgb(255, 255, 255);
        height: 100%;
        width: 100%;   
    }
    
</style>
