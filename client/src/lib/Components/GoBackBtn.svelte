<script>
	
	import { goto } from "$app/navigation";
   
    
    /**
	 * @type {any}
	 */
     export let url;
</script>

<button class="btn"  on:click={() => goto(url)} >Back</button>
<style>
    .btn {
        padding: 5px 10px;
    }

</style>