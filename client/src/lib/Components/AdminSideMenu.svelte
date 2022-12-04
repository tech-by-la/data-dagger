<script lang="ts">
    import { Divider } from "@svelteuidev/core";
    export let menuItems = [];
</script>

<style>
    h2 {
        align-self: center;
    }

    .container {
        display: flex;
        width: 170px;
        flex: 0 1 auto;
        border-right: #798AC5 solid 1px;
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        background-color: #144E75;
        flex: 1;
        position: sticky;
        padding: 20px;
    }

</style>

<div class="container">
    <div class="wrapper">
        <h2>Menu</h2>
        {#each menuItems as item}
            <Divider
                size="xs"
                label={item.name}
                variant="dashed"
                labelPosition="center"
                labelProps={{ variant: 'link', href: item.target, root: 'a' }}
                color="pink"
            />

        {/each}
    </div>
</div>
