<script lang="ts">
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';
    import Card from "$lib/Components/Card.svelte";
    import Separator from "$lib/Components/Separator.svelte";

    export let data: PageData;
    const { allUsers, allOrganizations, allProjects } = data;
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
        width: 160px;
    }
</style>

<div class="container">
    <h1>Admin Dashboard</h1>

    <div class="cards">
        <div class="card" on:click={() => goto('/admin/dashboard/users')}>
            <Card radius="15" padding="20" border="1px solid #bdbdbd" bgColor="#303030">
                <div class="card-container">
                    <span>Total Users:</span>
                    <span>{allUsers.length}</span>
                </div>
            </Card>
        </div>
        <Separator w="20"/>
        <div class="card" on:click={() => goto('/admin/dashboard/organizations')}>
            <Card radius="15" padding="20" border="1px solid #bdbdbd" bgColor="#303030">
                <div class="card-container">
                    <span>Total Organizations:</span>
                    <span>{allOrganizations.length}</span>
                </div>
            </Card>
        </div>
        <Separator w="20"/>
        <div class="card" on:click={() => goto('/admin/dashboard/projects')}>
            <Card radius="15" padding="20" border="1px solid #bdbdbd" bgColor="#303030">
                <div class="card-container">
                    <span>Total Projects:</span>
                    <span>{allProjects.length}</span>
                </div>
            </Card>
        </div>
    </div>

</div>
