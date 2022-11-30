<script>
    import Navbar from "$lib/Components/Navbar.svelte";
    import Footer from "$lib/Components/Footer.svelte"
    import "@fontsource/oswald";
</script>



<main>
    <Navbar />
    <slot />
    <Footer />
</main>


<style global>
    main {
        font-family: 'Oswald';
        color: rgb(255, 255, 255);
        min-height:max-content;
        width: 100%;  
    }
    html {
        background: #283871;
    }
    
        
</style>
