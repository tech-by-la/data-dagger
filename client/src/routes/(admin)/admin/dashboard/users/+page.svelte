<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { InfoBadge, IconButton, Flyout, Checkbox, ProgressRing } from "fluent-svelte";
    import FaChevronDown from 'svelte-icons/fa/FaChevronDown.svelte'
    import FaChevronLeft from 'svelte-icons/fa/FaChevronLeft.svelte';

    const { users, user: loggedInUser } = $page.data;

    let disableIndex: number | undefined;
    let disableRoleIndex: number | undefined;
    let disabled = false;

    const handleSetEnabled = async (index: number) => {
        disabled = true;
        disableIndex = index;
    }

    const handleSetRole = async (index: number) => {
        disabled = true;
        disableRoleIndex = index;
    }
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
        opacity: 1;
        height: 50px;
    }

    thead > tr {
        background-color: inherit !important;
        height: 35px;
    }

    tr:nth-child(odd) {
        background-color: #ffffff12;
    }

    .enabled {
        text-align: center;
    }

    .flex-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 20px 20px 20px;
    }

    a {
        color: white;
    }

</style>

<div class="container">
    <div class="flex-row">
        <IconButton on:click={() => goto('../')}><FaChevronLeft/></IconButton>
        <h1>Users</h1>
        <span></span>
    </div>
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
        {#each users as user, index}
            <tr>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>
                    {#if disableRoleIndex === index}
                        <ProgressRing/>
                    {:else}
                        {user.roles.map(role => " " + role.name)}
                    {/if}
                </td>
                <td>{new Date(user.created_at).toLocaleString('ja').split(' ')[0]}</td>
                <td class="enabled">
                    {#if disableIndex === index}
                        <ProgressRing />
                    {:else }
                        <InfoBadge severity={user.enabled ? "success" : "critical"}/>
                    {/if}
                </td>
                <td>
                    <Flyout placement="bottom" alignment="end">
                        <IconButton><FaChevronDown/></IconButton>
                        <svelte:fragment slot="flyout">
                            <div>

                                <!-- ENABLE / DISABLE USER -->
                                <form action="?/setEnabled" method="post">
                                    <input name="user_id" type="hidden" value={user.id}>
                                    <input name="enabled" type="hidden" value={!user.enabled}>
                                    <Checkbox
                                            on:click={() => handleSetEnabled(index)}
                                            onchange="this.form.submit()"
                                            checked={user.enabled}
                                            disabled={disabled || user.roles.map(role => role.name).includes("ADMIN") || user.roles.map(role => role.name).includes("SUPER_ADMIN")}
                                    >
                                        Enabled
                                    </Checkbox>
                                </form>
                            </div>

                            {#if loggedInUser.roles.includes('SUPER_ADMIN')}
                                <div>
                                    <!-- GRANT USER ROLE -->
                                    <form action="?/setRole" method="post">
                                        <input name="user_id" type="hidden" value={user.id}>
                                        <input name="role" type="hidden" value={'USER'}>
                                        <input name="remove" type="hidden" value={!user.roles.map(role => role.name).includes('USER')}>
                                        <Checkbox
                                            on:click={() => handleSetRole(index)}
                                            onchange="this.form.submit()"
                                            checked={user.roles.map(role => role.name).includes('USER')}
                                            disabled={user.roles.map(role => role.name).includes('USER')}
                                        >
                                            USER
                                        </Checkbox>
                                    </form>
                                </div>
                                <div>
                                    <!-- GRANT/REMOVE ADMIN ROLE -->
                                    <form action="?/setRole" method="post">
                                        <input name="user_id" type="hidden" value={user.id}>
                                        <input name="role" type="hidden" value={'ADMIN'}>
                                        <input name="remove" type="hidden" value={!user.roles.map(role => role.name).includes('ADMIN')}>
                                        <Checkbox
                                            on:click={() => handleSetRole(index)}
                                            onchange="this.form.submit()"
                                            checked={user.roles.map(role => role.name).includes('ADMIN')}
                                            disabled={disabled}
                                        >
                                            ADMIN
                                        </Checkbox>
                                    </form>
                                </div>
                                <div>
                                    <!-- GRANT/REMOVE SUPER ADMIN ROLE -->
                                    <form action="?/setRole" method="post">
                                        <input name="user_id" type="hidden" value={user.id}>
                                        <input name="role" type="hidden" value={'SUPER_ADMIN'}>
                                        <input name="remove" type="hidden" value={!user.roles.map(role => role.name).includes('SUPER_ADMIN')}>
                                        <Checkbox
                                            on:click={() => handleSetRole(index)}
                                            onchange="this.form.submit()"
                                            checked={user.roles.map(role => role.name).includes('SUPER_ADMIN')}
                                            disabled={disabled || user.id === loggedInUser.sub}
                                        >
                                            SUPER_ADMIN
                                        </Checkbox>
                                    </form>
                                </div>
                            {/if}
                        </svelte:fragment>
                    </Flyout>
                </td>
            </tr>

        {/each}
        </tbody>
    </table>
</div>
