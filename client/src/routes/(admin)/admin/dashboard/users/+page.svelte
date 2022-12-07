<script lang="ts">
    import type { PageData } from './$types';
    import { InfoBadge, IconButton, Flyout, Checkbox, ProgressRing } from "fluent-svelte";
    import FaChevronDown from 'svelte-icons/fa/FaChevronDown.svelte'
    import {PUBLIC_API_URL} from "$env/static/public";

    export let data: PageData;
    const { users, user: loggedInUser } = data;

    let disableIndex: number | undefined;
    let disableRoleIndex: number | undefined;
    let disabled = false;

    const handleSetEnabled = async (user_id: string, enabled: boolean, index: number) => {

        const start = Date.now();

        disabled = true;
        disableIndex = index;

        const response = await fetch(PUBLIC_API_URL + '/auth/admin/user-enabled' + `?user_id=${user_id}&enabled=${enabled}`, {
            method: "PUT",
            credentials: "include",
        });

        if (response.ok) {
            users[index].enabled = enabled;
        }

        if (response.status === 401) {
            // this fetch does not trigger the handle hook to refresh idTokens,
            // so if the request was unauthorized we force the page to reload
            // which triggers the handle hook.
            window.location.reload();
        }

        setTimeout(async () => {
            disableIndex = undefined;
            disabled = false;
        }, 500 - (Date.now() - start)); // at least 500ms
    }

    const handleSetRole = async (user_id: string, role: string, remove: boolean, index: number) => {

        const start = Date.now();

        disabled = true;
        disableRoleIndex = index;

        const response = await fetch(PUBLIC_API_URL + '/auth/admin/user-roles', {
            method: 'PUT',
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({user_id, role, remove}),
        });

        if (response.ok) {
            if (remove)
                users[index].roles = users[index].roles.filter(r => r.name !== role)
            else
                users[index].roles = [...users[index].roles, { name: role }];
        }

        if (response.status === 401) {
            // this fetch does not trigger the handle hook to refresh idTokens,
            // so if the request was unauthorized we force the page to reload
            // which triggers the handle hook.
            window.location.reload();
        }

        setTimeout(async () => {
            disableRoleIndex = undefined;
            disabled = false;
        }, 500 - (Date.now() - start)); // at least 500ms
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
        background-color: #144E75;
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
                                <Checkbox
                                        on:click={() => handleSetEnabled(user.id, !user.enabled, index)}
                                        checked={user.enabled}
                                        disabled={disabled || user.roles.map(role => role.name).includes("ADMIN") || user.roles.map(role => role.name).includes("SUPER_ADMIN")}
                                >
                                    Enabled
                                </Checkbox>
                            </div>
                            <div>
                                <!-- GRANT USER ROLE -->
                                <Checkbox
                                        on:click={() => handleSetRole(user.id, 'USER', user.roles.map(role => role.name).includes('USER'), index )}
                                        checked={user.roles.map(role => role.name).includes('USER')}
                                        disabled={user.roles.map(role => role.name).includes('USER')}
                                >
                                    USER
                                </Checkbox>
                            </div>
                            <div>
                                <!-- GRANT/REMOVE ADMIN ROLE -->
                                <Checkbox
                                        on:click={() => handleSetRole(user.id, 'ADMIN', user.roles.map(role => role.name).includes('ADMIN'), index )}
                                        checked={user.roles.map(role => role.name).includes('ADMIN')}
                                        disabled={disabled}
                                >
                                    ADMIN
                                </Checkbox>
                            </div>
                            <div>
                                <!-- GRANT/REMOVE SUPER ADMIN ROLE -->
                                <Checkbox
                                        on:click={() => handleSetRole(user.id, 'SUPER_ADMIN', user.roles.map(role => role.name).includes('SUPER_ADMIN'), index )}
                                        checked={user.roles.map(role => role.name).includes('SUPER_ADMIN')}
                                        disabled={disabled || user.id === loggedInUser.sub}
                                >
                                    SUPER_ADMIN
                                </Checkbox>
                            </div>
                        </svelte:fragment>
                    </Flyout>
                </td>
            </tr>

        {/each}
        </tbody>
    </table>
</div>
