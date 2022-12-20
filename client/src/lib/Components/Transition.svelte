<script lang="ts">
    import { fly, fade, slide } from "svelte/transition";
    export let url: URL

</script>
{#key url}
    <div in:fade={{ duration: 300}}>
    <slot />
    </div>
{/key}
