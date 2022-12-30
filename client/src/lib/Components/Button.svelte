
<script>

    /**
	 * @type {any}
	 */
     export let btnClick;
    /**
	 * @type {any}
	 */
     export let btnTitle = '';
     export let width = "auto"
    export let active = false;
</script>

<button class="btn {active ? 'active' : ''}" style="width:{width};" on:click={btnClick} >{btnTitle}<slot/></button>

<style>


    .active {
        background: #43448d;
    }
</style>
