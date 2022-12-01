<script>
    import Navbar from "$lib/Components/Navbar.svelte";
    import Footer from "$lib/Components/Footer.svelte"
    import "@fontsource/oswald";
</script>


<div class="wrapper">
    <main>
        <div class="navbar">
            <Navbar />
        </div>
        
        <div class="slot">
            <slot />
        </div>
        
        <div class="footer">
            <Footer />
        </div>
        
    </main>
</div>



<style global>
    html {
        background: #283871;
        font-family: 'Oswald';
        color: rgb(255, 255, 255);
        width: 100%
        }
    
    main {
        margin: 0;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .slot {
        flex: 1;
        
    }
    
    
    
        
</style>
