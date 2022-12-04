<script lang="ts">
    export let width = 'fit-content';
    export let bgColor = "grey";
    export let padding = 2;
    export let border: null = null;
    export let radius = 2;
</script>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<div class="container" style={`
        width: ${width};
        background-color: ${bgColor};
        padding: ${padding}px;
        border-radius: ${radius}px;
        border: ${border};
    `}>
    <slot/>
</div>
