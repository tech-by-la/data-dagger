<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import Card from "$lib/Components/Card.svelte";
    import Separator from "$lib/Components/Separator.svelte";
    import {Button} from "fluent-svelte";

    const { allUsers, allOrganizations, allProjects, unreadLogs } = $page.data;
</script>

<style>
    .container {
        display: flex;
        flex-direction: column;
        flex: 1;
        align-items: center;
        padding: 20px;
    }

    .cards {
        display: flex;
        flex-direction: row;
    }

    .card:hover {
        scale: 1.05;
        cursor: pointer;
    }

    .card-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 160px;
    }

    .error {
        color: #c40606;
        font-weight: bold;
    }

    .dot {
        width: 8px;
        height: 8px;
        border-radius: 5px;
        animation: pulse 1s ease-in-out infinite alternate;
    }

    .normal-logs  { background-color: #fff }
    .success-logs { background-color: #55b45a }
    .warning-logs { background-color: #ffd700 }
    .error-logs   { background-color: #c40606 }
    .admin-logs   { background-color: #da90f8 }

    @-webkit-keyframes pulse {
        from {
            box-shadow: 0 0 8px var(--color) ;
        }
        to {
            box-shadow: 0 0 12px var(--color);
        }
    }
</style>

<div class="container">
    <h1>Admin Dashboard</h1>

    <div class="cards">
        <div class="card" on:click={() => goto('/admin/dashboard/users')}>
            <Card radius="15" padding="20" border="1px solid #bdbdbd" bgColor="#30303080">
                <div class="card-container">
                    <span>Total Users:</span>
                    <span>{allUsers}</span>
                </div>
            </Card>
        </div>
        <Separator w="20"/>
        <div class="card" on:click={() => goto('/admin/dashboard/organizations')}>
            <Card radius="15" padding="20" border="1px solid #bdbdbd" bgColor="#30303080">
                <div class="card-container">
                    <span>Total Organizations:</span>
                    <span>{allOrganizations}</span>
                </div>
            </Card>
        </div>
        <Separator w="20"/>
        <div class="card" on:click={() => goto('/admin/dashboard/projects')}>
            <Card radius="15" padding="20" border="1px solid #bdbdbd" bgColor="#30303080">
                <div class="card-container">
                    <span>Total Projects:</span>
                    <span>{allProjects}</span>
                </div>
            </Card>
        </div>
        <Separator w="20"/>
        <div class="card" on:click={() => goto('/admin/dashboard/logging')}>
            <Card radius="15" padding="20" border="1px solid #bdbdbd" bgColor="#30303080">
                <div class="card-container">
                    <span>Logs</span>
                    {#if unreadLogs.normal > 0}<span style="--color: #cbcbcb" class="dot normal-logs"></span>{/if}
                    {#if unreadLogs.success > 0}<span style="--color: #cbcbcb" class="dot success-logs"></span>{/if}
                    {#if unreadLogs.warning > 0}<span style="--color: #ffd700" class="dot warning-logs"></span>{/if}
                    {#if unreadLogs.error > 0}<span style="--color: #c40606" class="dot error-logs"></span>{/if}
                    {#if unreadLogs.admin > 0}<span style="--color: #da90f8" class="dot admin-logs"></span>{/if}
                </div>
            </Card>
        </div>
    </div>
    <div style="margin-top: 20px">
        <form method="post">
            <Button disabled={true}>Update Main Feature Type</Button>
        </form>
    </div>
    {#if $page.form}
        <div class="error">
            <p>{$page.form.message}</p>
        </div>
    {/if}

</div>
