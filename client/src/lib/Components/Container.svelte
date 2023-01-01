<script>
    export let width = 'auto';
    export let color = "#282158"
    export let color2 = '#43448d80'
</script>

<div class="con-div" style="--color:{color}; --color2:{color2}; max-width: {width} !important;">
    <slot />
</div>
<style>
    .con-div{
        border-radius: 5px;
        margin: 10px 10px 0px 10px;
        padding: 10px;
        backdrop-filter: blur(10px);
        background-blend-mode:soft-light;
        background-color: #31313cb2;
        /* border: 1px solid var(--color); */
        box-shadow: 0px 0px 5px 0px var(--color);
        /* box-shadow:0px 0px 0px 7px var(--color) inset; */
        
    }
    .con-div:hover {
    /* border: 3px solid var(--color3) inset; */
    /* border: 0; */
    /* padding: 2px; */
    /* box-shadow:0px 0px 0px 2px var(--color3) ; */
    box-shadow: 0px 0px 10px var(--color) ;
    transition: all 0.2s ease-in-out;
    /* animation: pulse 2s linear infinite; */
    }
    /* @keyframes pulse {
	0% {
		transform: scale(1);
		box-shadow: 1px 0 5px 2px var(--color2);
	}
	12.5% {
		transform: scale(1);
		box-shadow: 0.5px 0.5px 5px 2px var(--color2);
	}
	25% {
		transform: scale(1);
		box-shadow: 0 1px 5px 2px var(--color2);
	}
	37.5% {
		transform: scale(1);
		box-shadow: -0.5px 0.5px 5px 2px var(--color2);
	}
	50% {
		transform: scale(1);
		box-shadow: -1px 0 5px 2px var(--color2);
	}
	62.5% {
		transform: scale(1);
		box-shadow: -0.5px -0.5px 5px 2px var(--color2);
	}
	
	75% {
		transform: scale(1);
		box-shadow: 0 -1px 5px 2px var(--color2);
	}
	88.5% {
		transform: scale(1);
		box-shadow: 0.5px -0.5px 5px 2px var(--color2);
	}
	100% {
		transform: scale(1);
		box-shadow: 1px 0px 5px 2px var(--color2);
	} */
/* } */
</style>
