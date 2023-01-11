<script lang="ts">
    import { page } from "$app/stores";
    import Rotate from "svelte-icons/md/MdRotateRight.svelte"
    import Container from "$lib/Components/Container.svelte";
    import {Button, IconButton} from "fluent-svelte";

    const { type = 'all', total } = $page.data;

    let { logs } = $page.data;
    let rotate = false;
    let pageNumber = 0;

    const handleLoadMore = async () => {
        rotate = true;
        const response = await fetch(`/admin/dashboard/logging/load-more?page=${++pageNumber}`);

        if (!response.ok) {
            rotate = false;
            return;
        }

        const data = await response.json();

        setTimeout(() => {
            logs = [...logs, ...data];
            rotate = false;
        }, 1000);

    }
</script>

<div class="content">
    <Container padding="15px">
        <div class="header">
            <form class="filter" action="?/apply" method="post">
                <div>
                    <label for="type">Filter: </label>
                    <select id="type" name="type" onchange="this.form.submit()"
                        style="background-color: {
                          type === 'success' ? '#55b45a'
                        : type === 'warning' ? '#ffd700'
                        : type === 'error' ? '#c40606'
                        : type === 'admin' ? '#da90f8'
                        : '#dedede'
                        }"
                    >
                        <option selected={type === 'all' ? "selected" : null} style="background-color: #fff" value="all">All</option>
                        <option selected={type === 'normal' ? "selected" : null} style="background-color: #dedede" value="normal">Normal</option>
                        <option selected={type === 'success' ? "selected" : null} style="background-color: #55b45a" value="success">Success</option>
                        <option selected={type === 'warning' ? "selected" : null} style="background-color: #ffd700" value="warning">Warning</option>
                        <option selected={type === 'error' ? "selected" : null} style="background-color: #c40606" value="error">Error</option>
                        <option selected={type === 'admin' ? "selected" : null} style="background-color: #da90f8" value="admin">Admin</option>
                    </select>
                </div>
            </form>
            <form method="post" action="?/clear">
                <Button>Clear Logs</Button>
            </form>
        </div>
        <div class="log-container">
            {#each logs as log, index}
                <div class="log"
                     style="margin-top: {index === logs.length-1 ? 0 : 14}px;
                        color: {
                          log.type === 'success' ? '#55b45a'
                        : log.type === 'warning' ? '#ffd700'
                        : log.type === 'error' ? '#c40606'
                        : log.type === 'admin' ? '#da90f8'
                        : '#dedede'
                }">
                    <code>{log.date}:</code>
                    <code>{log.log}</code>
                </div>
            {/each}
            {#if logs.length < total}
                <IconButton on:click={handleLoadMore}>
                    Load More <div class="rotate-icon {rotate ? 'rotate' : ''}"><Rotate/></div>
                </IconButton>
            {/if}
        </div>
    </Container>
</div>

<style>
    .content {
        text-align: center;
        width: 100%;
    }

    .header {
        display: flex;
        justify-content: space-between;
    }

    .filter {
        display: flex;
        justify-content: space-evenly;
    }

    .log-container {
        display: flex;
        flex-direction: column-reverse;

        width: calc(100% - 20px);
        max-height: calc(100vh - 222px);
        margin-top: 10px;
        border: 2px solid white;
        border-radius: 5px;
        background-color: black;
        padding: 8px;
        text-align: left;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .log {
        display: grid;
        grid-template-columns: 160px auto;
    }

    .rotate-icon {
        margin: 0 0 -5px 5px;
    }

    .rotate {
        animation: rotation 1s infinite linear;
        -webkit-transform-origin: 50% 40%;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg)
        }
        100% {
            transform: rotate(360deg)
        }
    }
</style>
