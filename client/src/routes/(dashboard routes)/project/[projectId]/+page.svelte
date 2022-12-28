<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import {Button} from "fluent-svelte";

    const { user, project, features, org } = $page.data;
    enum Status {
        PENDING = 'PENDING',
        STARTED = 'STARTED',
        FINISHED = 'FINISHED',
    }

    let status = features.length === 0
        ? Status.PENDING
        : features.filter(f => f.properties.status !== 'ready').length === features.length
        ? Status.FINISHED
        : Status.STARTED;

    let disableJoin   = false;
    let disableDemo   = false;
    let disableDelete = false;
    let disableExport = false;

    const isMember = project.members.includes(user.sub);
    const isMod = org.members[0].org_role_id === 'OWNER' || org.members[0].org_role_id === 'MODERATOR';

    const checkedFeatures = features.filter((f: { properties: { status: string; }; }) => f.properties.status !== 'ready').length;
    const approvedFeatures = features.filter((f: { properties: { status: string; }; }) => f.properties.status === 'ok').length;
    const failedFeatures = features.filter((f: { properties: { status: string; }; }) => f.properties.status === 'fail').length;

    let demoSize = 30;

    const handleExport = async () => {
        disableExport = true;

        const response = await fetch(`/api/export/${project.id}`);
        if (!response.ok) {
            window.location.reload();
            return;
        }
        const blob: Blob = await response.blob();
        const fileUrl = URL.createObjectURL(blob);
        const link: HTMLAnchorElement = document.createElement('a');

        const org_name = org.name.replace(/[^\w ]/g, '').replace(' ', '').toLowerCase();
        const proj_name = project.name.replace(/[^\w ]/g, '').replace(' ', '').toLowerCase();
        const date = new Date().toISOString().replaceAll('-', '').replaceAll('_', '').replaceAll(':', '').replaceAll('T', '').split('.')[0]
        const fileName = `${org_name}_${proj_name}_${date}`;

        link.href = fileUrl;
        link.download = `${fileName}.geojson`;
        link.click();
        URL.revokeObjectURL(fileUrl);
        
        disableExport = false;
    }
</script>

<div class="content">
    <div class="action-button">
        <form method="post" action="?/joinOrLeave">
            <Button disabled={disableJoin} on:click={() => disableJoin = true}>
                {isMember ? 'Leave Project' : 'Join Project'}
            </Button>
            <input name="project_id" type="hidden" value={project.id}>
        </form>
    </div>

    <div class="mod-console">
        <h3>Details</h3>
        <p>Organization:</p><p>{org.name}</p>
        <p>Project Type:</p><p>{project.type}</p>
        <p>Project Created:</p><p>{new Date(project.created_at).toLocaleDateString()}</p>
        <p>Joined Workers:</p><p>{project.members.length}</p>
        <p>Status:</p><p>{status}</p>

        {#if status === Status.FINISHED}
            <div class="grid-span">
                <Button disabled={disableExport} on:click={handleExport}>Export Data</Button>
            </div>
        {/if}

        {#if features.length > 0}
            <hr class="grid-span">
            <h3>Features</h3>
            <p>Total:</p><p>{features.length}</p>
            <p>Checked:</p><p>{checkedFeatures} / {features.length}</p>
            <p>Approved:</p><p>{approvedFeatures}</p>
            <p>Failed:</p><p>{failedFeatures}</p>
        {/if}

        {#if isMod && status === Status.PENDING}
            <hr class="grid-span">
            <p class="grid-span">Upload project data to start the project!</p>
            <p class="grid-span">You can upload a .geojson or generate a demo project</p>
            <div class="button"><Button disabled>Upload</Button></div>
            <form method="post" action="?/startDemo">
                <div class="longbutton">
                    <Button disabled={disableDemo} on:click={() => disableDemo = true}>
                        Use Demo
                    </Button>
                </div>
                <div class="slider-con">
                    <label for="size">Size:</label>
                    <input name="size" type="range" min="10" max="100" bind:value={demoSize} class="slider">
                    <span>{demoSize}</span>
                </div>
                <input name="project_id" type="hidden" value={project.id}>

            </form>
        {/if}

        {#if features.length > 0}
            <hr class="grid-span">
            <h3>Dev Menu</h3>
            <form class="grid-span" method="post" action="?/delete">
                <Button disabled={disableDelete} on:click={() => disableDelete = true}>
                    Delete all features
                </Button>
                <input name="project_id" type="hidden" value={project.id}>
            </form>
        {/if}
    </div>

    <div style="text-align: center">
        <h1>Project {project.name}</h1>
        <h2>{project.description}</h2>
        {#if project.members.includes(user.sub) && status === Status.STARTED}
            <Button on:click={() => goto(`${$page.url.pathname}/workzone`)}>Workzone</Button>
        {/if}
    </div>
    <div style="width: 250px"></div>
</div>

<style>
    .content {
        position: relative;
        display: flex;
        justify-content: space-between;
    }

    .mod-console {
        width: 250px;
        margin-left: 10px;
        margin-top: 10px;
        padding: 16px;
        border-radius: 8px;
        background-color: #1f2029cc;
        display: grid;
        grid-template-columns: auto auto;
    }

    .mod-console h1, h2, h3 {
        margin: 10px;
        grid-column: 1 / span 2;
        text-align: center;
    }

    .mod-console p {
        text-align: start;
        margin: 0 0 10px 25px;
    }

    .mod-console hr {
        width: 100%;
        border-top: 1px;
    }

    .grid-span {
        grid-column: 1 / span 2;
        text-align: center;
    }

    .action-button {
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .slider {
        width: 50px;
        margin-top: 10px;
    }
</style>

