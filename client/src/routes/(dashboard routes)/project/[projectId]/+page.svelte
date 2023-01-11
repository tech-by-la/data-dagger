<script lang="ts">
    import { page } from '$app/stores';
    import {goto} from '$app/navigation';
    // import {Button} from "fluent-svelte";
    import GeoJSON from "ol/format/GeoJSON";
    import Container from '$lib/Components/Container.svelte';
    import Line from "$lib/Components/Line.svelte";
    import { fly, slide, blur } from 'svelte/transition';
    import Btn from '$lib/Components/Button.svelte';
	import Button from '$lib/Components/Button.svelte';

    const { user, project, org, projectData, projectComments, colors } = $page.data;

    const features = projectData.features;
    const comments = projectComments.features;

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
    let disableDelete = false;

    const isMember = project.members.includes(user.sub);
    const isOwner = org.members[0].org_role_id === 'OWNER';
    const isMod = org.members[0].org_role_id === 'OWNER' || org.members[0].org_role_id === 'MODERATOR';
    const isAdmin = user.roles.includes('SUPER_ADMIN') || user.roles.includes('ADMIN');

    const checkedFeatures = features.filter((f: { properties: { status: string; }; }) => f.properties.status !== 'ready').length;
    const approvedFeatures = features.filter((f: { properties: { status: string; }; }) => f.properties.status === 'ok').length;
    const failedFeatures = features.filter((f: { properties: { status: string; }; }) => f.properties.status === 'fail').length;

    let demoSize = 30;

    const handleExport = async (exportComments: boolean) => {
        const timestamp = new Date();

        exportComments
            ? projectComments.timeStamp = timestamp.toISOString()
            : projectData.timeStamp = timestamp.toISOString();

        fetch(`/api/features/log-export?project=${project.id}&comments=${exportComments}`);

        const data = exportComments ? projectComments : projectData;

        const blob: Blob = new Blob([JSON.stringify(data)], { type: "application/json" });
        const fileUrl = URL.createObjectURL(blob);
        const link: HTMLAnchorElement = document.createElement('a');

        const org_name = org.name.replaceAll(/[^\w ]/g, '').replaceAll(' ', '').toLowerCase();
        const proj_name = project.name.replaceAll(/[^\w ]/g, '').replaceAll(' ', '').toLowerCase();
        const date = timestamp.toLocaleString('fr-ca').replaceAll(/[^0-9]/g, '');
        const type = exportComments ? '_comments' : '';
        const fileName = `${org_name}_${proj_name}_${date}${type}`;

        link.href = fileUrl;
        link.download = `${fileName}.geojson`;
        link.click();
        URL.revokeObjectURL(fileUrl);
    }
</script>
<div class="wrapper" in:slide="{{delay: 500, duration: 500}}" out:blur="{{delay: 0, duration: 500}}">


<Container color={colors.redDark} color2={colors.redMediumTransparent}>
    <div class="top-panel">

      <div class="user-info">
        <div class="user">
          <b style="color: var(--greenLight)">User:</b>
          <p>{user.email}</p>
        </div>

        <div class="org" >
          <b style="color: var(--yellowLight)">Organization:</b>
          <p> {org.name}</p>
        </div>


        <div class="project">
          <b style="color: var(--redLight)">Project:</b>
          <p> {project.name}</p>
        </div>


      </div>

      <div class="title">
        <h1> <b style="color: var(--redLight);">-</b>  Project Dashboard <b style="color: var(--redLight);">-</b> </h1>
      </div>

      <div class="back-div">
        <div class="back-div">
        <Button
          btnClick= {() => goto(`/org/${org.id}`)}
          btnTitle="Back"
          colorLight={colors.redLight}
          colorMedium={colors.redMedium}
          colorDark={colors.redDark}
          width="100px"
          >
        </Button>
      </div>
      </div>

    </div>
  </Container>

<div class="panels">

    <div class="panel info-panel">
        <Container color={colors.redDark} color2={colors.redMediumTransparent}>
            <div class="info-text">
                <div style="text-align: center">
                    <h1>{project.name}</h1>
                </div>
                <Line color={colors.redLight}></Line>
                <p> Project description: </p>
                <p>{project.description}</p>
                <Line color={colors.redLight}></Line>
                <p>Navigate to the workzone to perform QA</p>


                <h3><Line color={colors.redLight}></Line></h3>
                <div class="proj-btn" >
                    {#if project.members.includes(user.sub) && status === Status.STARTED}
                        <Btn
                                btnClick={() => goto(`${$page.url.pathname}/workzone`)}
                                btnTitle="Work Zone"
                                colorLight={colors.redLight}
                                colorMedium={colors.redMedium}
                                colorDark={colors.redDark}
                                width="100%"
                        >
                        </Btn>
                    {/if}
                </div>

                <form class="form-btn" method="post" action="?/joinOrLeave">
                    <Btn
                        btnClick={() => disableJoin = true}
                        btnType="submit"
                        btnTitle={isMember ? 'Leave Project' : 'Join Project'}
                        colorLight={colors.redLight}
                        colorMedium={colors.redMedium}
                        colorDark={colors.redDark}
                        width="100%"
                        >
                    </Btn>
                    <input name="project_id" type="hidden" value={project.id}>
                </form>

                {#if (isAdmin || isOwner) && features.length > 0}
                    <form class="form-btn" method="post" action="?/delete">
                        <Btn
                            btnType="submit"
                            btnClick={() => disableDelete = true}
                            btnTitle="Delete all features"
                            colorLight={colors.redLight}
                            colorMedium={colors.redMedium}
                            colorDark={colors.redDark}
                            width="100%"
                        >
                        </Btn>
                        <input name="project_id" type="hidden" value={project.id}>
                    </form>
                {/if}

            </div>
        </Container>


    </div>
        <div class="panel">
            <Container color={colors.redDark} color2={colors.redMediumTransparent}>

            <div class="mod-console">
                <h3>Details</h3>
                <h3><Line color={colors.redLight}></Line></h3>
                <p>Organization:</p><p>{org.name}</p>
                <p>Project Type:</p><p>{project.type}</p>
                <p>Project Created:</p><p>{new Date(project.created_at).toLocaleDateString()}</p>
                <p>Workers Joined:</p><p>{project.members.length}</p>
                <p>Status:</p><p>{status}</p>
            </div>
            </Container>
        </div>
        {#if features.length > 0}
        <div class="panel">

            <Container color={colors.redDark} color2={colors.redMediumTransparent}>

                <div class="mod-console">
                    <h3>Features</h3>
                    <h3><Line color={colors.redLight}></Line></h3>
                    <p>Total:</p><p>{features.length}</p>
                    <p>Checked:</p><p>{checkedFeatures} / {features.length}</p>
                    <p>Approved:</p><p>{approvedFeatures}</p>
                    <p>Failed:</p><p>{failedFeatures}</p>
                    {#if (isAdmin || isMod)}
                        <div class="grid-span">
                            <!-- <Button on:click={() => handleExport(false)}>Export Features</Button> -->
                            <Btn
                                btnClick={() => handleExport(false)}
                                btnTitle="Export Features"
                                colorLight={colors.redLight}
                                colorMedium={colors.redMedium}
                                colorDark={colors.redDark}
                                width="80%"
                                >
                            </Btn>
                        </div>
                    {/if}
                </div>


            </Container>

        </div>
        {/if}
        {#if features.length > 0}
        <div class="panel">

            <Container color={colors.redDark} color2={colors.redMediumTransparent}>
                <div class="mod-console">
                    <h3>Comments</h3>
                    <h3><Line color={colors.redLight}></Line></h3>
                    <p>Total:</p><p>{comments.length}</p>
                    {#if (isAdmin || isMod) && comments.length > 0}
                        <div class="grid-span">
                            <!-- <Button on:click={() => handleExport(true)}>Export Comments</Button> -->
                            <Btn
                                btnClick={() => handleExport(true)}
                                btnTitle="Export Comments"
                                colorLight={colors.redLight}
                                colorMedium={colors.redMedium}
                                colorDark={colors.redDark}
                                width="80%"
                                >
                            </Btn>
                        </div>
                    {/if}
                </div>
            </Container>

        </div>
        {/if}

        {#if isMod && status === Status.PENDING}
        <div class="panel">

            <Container color={colors.redDark} color2={colors.redMediumTransparent}>
            <div class="mod-console">
            <h3>Start Project</h3>
            <h3><Line color={colors.redLight}></Line></h3>
            <p class="grid-span">Upload project data to start the project!(Disabled for now)</p>
            <p class="grid-span">You can upload a .geojson or generate a demo project</p>
            <h3><Line color={colors.redLight}></Line></h3>
            <div class="grid-span">
                <form method="post" action="?/startDemo">
                    <div class="longbutton">
                        <Btn
                        btnTitle="Use Demo"
                        colorLight={colors.redLight}
                        colorMedium={colors.redMedium}
                        colorDark={colors.redDark}
                        btnType="submit"
                        width="80%"
                        ></Btn>
                    </div>
                    <div class="slider-con">
                        <label for="size">Size:</label>
                        <input name="size" type="range" min="1" max="100" bind:value={demoSize} class="slider">
                        <span>{demoSize}</span>
                    </div>
                    <input name="project_id" type="hidden" value={project.id}>
                </form>
            </div>
             </div>
            </Container>
            </div>
        {/if}
  </div>
</div>

<style>

    .mod-console {
        /* width: 250px; */
        /* height: 500px; */
        margin: 10px;
        /* padding: 16px; */
        border-radius: 8px;
        /* background-color: #1f2029cc; */
        display: grid;
        grid-template-columns: auto auto;
    }

    .mod-console h3 {
        margin: 10px;
        grid-column: 1 / span 2;
        text-align: center;
    }

    .mod-console p {
        text-align: start;
        margin: 0 0 10px 25px;
    }

    .grid-span {
        grid-column: 1 / span 2;
        text-align: center;
    }

    .slider {
        width: 50px;
        margin-top: 10px;
    }
    .panel {
        flex: 1;
        /* height: 800px; */
        /* width: 310px; */
        padding-top: 10px;
    }
    .panels {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: space-around;
    }
    .proj-btn{
        display: flex;
    }
    .form-btn {
        display: flex;
        width: 100%;
    }
    .btns-panel{
        flex: 1;
    }
    .top-panel {
    display: flex;
    justify-content: space-around;
    height: 30px;
  }
  .title {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: center;
    font-size: 15px;

    }
  .back-div{
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: right;
    font-size: 15px;
    width: 50%;
    padding: 5px;
  }
  .user-info {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: space-around;

  }
  .user-info p, .user-info b{
    margin: 0;
  }
  .user, .org, .project {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

</style>

