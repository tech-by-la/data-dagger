
<script>

    /**
	 * @type {any}
	 */
     export let btnClick;
    /**
	 * @type {any}
	 */
     export let btnTitle;
     export let width = "auto"
    export let active = false;
</script>

<button class="btn {active ? 'active' : ''}" style="width:{width};" on:click={btnClick} >{btnTitle}</button>

<style>
    .btn {
        color: rgb(255, 255, 255);
        font-size: 20px;
        line-height: 20px;
        padding: 10px;
        border-radius: 10px;
        font-family: 'Oswald';
        font-weight: normal;
        font-style: normal;
        font-variant: normal;
        text-transform: none;
        border: 3px solid #798AC5;
        display: inline-block;
        background: 0;
        margin: 5px;
        /* width: {width}; */
    }

    .btn:hover {
        cursor: pointer;
        background: #798AC5;
    }

    .btn:active {
        background: #144E75;
    }

    .active {
        background: #144E75;
    }
</style>
