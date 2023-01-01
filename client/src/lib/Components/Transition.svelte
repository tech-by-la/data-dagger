<script lang="ts">
    import { fly, fade, slide } from "svelte/transition";
    export let url: URL

</script>
{#key url}
    <div transition:fly="{{delay: 500, duration: 500, x: -500, y: 0, opacity: 0.5}}">
    <slot />
    </div>
{/key}
