<script>

	import { fly } from "svelte/transition";

</script>
<div class="div" transition:fly="{{delay: 500, duration: 500, x: -5000, y: 0, opacity: 0.5}}">
    <slot></slot>
</div>
