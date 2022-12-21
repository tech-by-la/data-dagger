<script>
    import { page } from '$app/stores';
    import {Button} from "fluent-svelte";

    const { organization, user, isOwner, } = $page.data;
    const { members } = organization;
    console.log(members);
</script>

<div class="content">
    <h1 class="grid-full">Members in {organization.name}</h1>

    <div class="grid-1">Email</div>
    <div class="grid-2">Name</div>
    <div class="grid-3">Role</div>
    <div class="grid-4"></div>

    <div class="line grid-full"></div>

    <!--  List of Members  -->
    {#each members as member, index}
        <div class="grid-row">
            <div class="grid-cell grid-1">{member.user.email}</div>
            <div class="grid-cell grid-2">{`${member.user.first_name} ${member.user.last_name}`}</div>
            <div class="grid-cell grid-3">{member.org_role_id}</div>
            <div class="grid-cell grid-4">
                {#if isOwner && member.org_role_id !== 'OWNER'}
                    <form method="post">
                        <Button>Kick</Button>
                        <input name="org_id" type="hidden" value={organization.id}>
                        <input name="user_id" type="hidden" value={member.user_id}>
                    </form>
                {/if}
            </div>
        </div>
    {/each}
</div>

<style>
    h1, h2 {
        text-align: center;
    }

    .content {
        position: relative;
        display: grid;
        width: 100%;
        grid-template-columns: auto auto auto 60px;
    }

    .add-button {
        position: absolute;
        top: 0;
        right: 0;
        width: fit-content;
        border: 2px solid white;
        border-radius: 8px;
    }

    .grid-row {
        display: contents;
    }

    .grid-cell {
        padding: 10px 0;
    }

    .grid-1 {
        grid-column: 1;
        padding-left: 10px
    }
    .grid-2 {
        grid-column: 2;
    }
    .grid-3 {
        grid-column: 3;
    }
    .grid-4 {
        grid-column: 4;
        text-align: end;
        padding-right: 20px;
        color: #c40606;
        font-weight: bold;
    }

    .grid-full {
        grid-column: 1 / span 4;
        padding: 10px;
    }

    .line {
        height: 1px;
        width: 100%;
        background-color: white;
        margin-top: 10px;
        padding: 0;
    }

</style>
