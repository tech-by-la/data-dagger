<script>
    export let width = 'auto';
    export let color = "#282158"
</script>

<div class="con-div" style="--color:{color}; max-width: {width} !important;">
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
        box-shadow: 0px 0px 5px var(--color);
        /* box-shadow:0px 0px 0px 7px var(--color) inset; */
        
    }
    .con-div:hover {
    /* border: 3px solid var(--color3) inset; */
    /* border: 0; */
    /* padding: 2px; */
    /* box-shadow:0px 0px 0px 2px var(--color3) ; */
    box-shadow: 0px 0px 10px var(--color) ;
    transition: all 0.3s ease-in-out;
    }
</style>
