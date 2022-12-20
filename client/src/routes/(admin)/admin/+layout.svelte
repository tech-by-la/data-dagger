<script lang="ts">
    import type { LayoutData } from "./$types.js";
    import AdminSideMenu from "$lib/Components/AdminSideMenu.svelte";

    export let data: LayoutData;
</script>

<style>
    .container {
        display: flex;
        flex-direction: row;
        min-height: calc(100vh - 120px - 40px);
    }
</style>

<div class="container">
<!--    <AdminSideMenu menuItems={data.menuItems}/>-->
    <slot/>
</div>
