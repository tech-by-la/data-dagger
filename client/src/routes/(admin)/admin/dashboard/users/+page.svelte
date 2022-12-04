<script lang="ts">
    import type { PageData } from './$types';
    import { InfoBadge, IconButton, Flyout, Checkbox } from "fluent-svelte";
    import FaChevronDown from 'svelte-icons/fa/FaChevronDown.svelte'

    export let data: PageData;
    const { users } = data;
</script>

<style>
    .container {
        width: 100%;
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
        height: 50px;
    }

    thead > tr {
        background-color: inherit !important;
        height: 35px;
    }

    tr:nth-child(odd) {
        background-color: #144E75;
    }

    tr:hover {
        opacity: 1;
    }

    .enabled {
        text-align: center;
    }

</style>

<div class="container">

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Roles</th>
                <th>Account Created</th>
                <th class="enabled">Account Enabled</th>
                <th></th>
            </tr>
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
                <td class="enabled"><InfoBadge severity={user.enabled ? "success" : "critical"}/></td>
                <td>
                    <Flyout placement="bottom" alignment="end">
                        <IconButton><FaChevronDown/></IconButton>
                        <svelte:fragment slot="flyout">
                            <form method="post" action="?/enable">
                                <input name="user_id" type="hidden" value={user.id}>
                                <input name="enabled" type="hidden" value={!user.enabled}>
                                <Checkbox checked={user.enabled} onChange="this.form.submit()">Enabled</Checkbox>
                            </form>
                        </svelte:fragment>
                    </Flyout>
                </td>
            </tr>

        {/each}
        </tbody>
    </table>
</div>
