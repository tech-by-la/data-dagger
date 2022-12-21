<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import {Button, ProgressRing} from "fluent-svelte";

    const { user, project } = $page.data;
    const isMember = project.members.includes(user.sub);
    let loading = false;
</script>

<div class="content">
        <h1>Project {project.name}</h1>

    <div class="action-button">
        <form method="post" >
            <Button disabled={loading} on:click={() => loading = true}>
                {isMember ? 'Leave Project' : 'Join Project'}
            </Button>
            <input name="project_id" type="hidden" value={project.id}>
        </form>
    </div>

    <Button on:click={() => goto(`${$page.url.pathname}/workzone`)}>Workzone</Button>
</div>

<style>
    .content {
        position: relative;
        text-align: center;
    }

    .action-button {
        position: absolute;
        top: 0;
        right: 20px;
    }
</style>

