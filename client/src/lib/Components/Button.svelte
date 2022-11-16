<script lang="ts">
    export let onClick;
    export let color = "bg-gray-600";
    export let title: string;
</script>

<div class={`w-16 h-16 ${color}`} on:click={onClick}>{title}</div>
