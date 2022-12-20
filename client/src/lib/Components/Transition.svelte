<script lang="ts">
    import { fly, fade, slide } from "svelte/transition";
    export let url: URL

</script>
{#key url}
    <div in:fade={{ duration: 1000}}>
    <slot />
    </div>
{/key}