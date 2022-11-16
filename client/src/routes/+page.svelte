<script>
    import Button from "$lib/Components/Button.svelte";

    const imgUrl = new URL('../../static/images/data-dagger-logo.png', import.meta.url).href
</script>

<h1>Data Dagger</h1>
<p>We cut out the faulty data</p>
<br/>

<Button title="Hello" onClick={() => { console.log("Alex mor er lækker") }} color="bg-amber-400" />

<img src="%sveltekit.assets%/images/data-dagger-logo.png" alt="goose-logo">
