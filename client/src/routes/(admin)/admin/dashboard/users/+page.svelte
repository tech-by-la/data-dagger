<script lang="ts">

    import type { PageData } from './$types';

    export let data: PageData;
    const { users } = data;
</script>

<style>
    .container {

    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    thead {
        text-align: left;
    }

    th:first-child, td:first-child {
        padding-left: 20px;
    }

    tr {
        opacity: 0.5;
    }

    tr:nth-child(odd) {
        background-color: #144E75;
    }

    tr:hover {
        opacity: 1;
    }

</style>

<div class="container">

</div>
<table>
    <thead>
    <th>ID</th>
    <th>Email</th>
    <th>First Name</th>
    <th>Last Name</th>
    <th>Roles</th>
    <th>Account Created</th>
    <th>Account Enabled</th>
    </thead>
    <tbody>
    {#each users as user}
        <tr>
            <td>{user.id}</td>
            <td>{user.email}</td>
            <td>{user.first_name}</td>
            <td>{user.last_name}</td>
            <td>{user.roles.map(role => role.name)}</td>
            <td>{new Date(user.created_at).toLocaleString('ja').split(' ')[0]}</td>
            <td>{user.enabled}</td>
        </tr>

    {/each}
    </tbody>
</table>
