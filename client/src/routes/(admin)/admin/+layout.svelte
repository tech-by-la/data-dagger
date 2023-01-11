<script lang="ts">
    import { page } from '$app/stores';

    const { date } = $page;
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
