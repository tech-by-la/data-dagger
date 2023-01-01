<script lang="ts">
    import { page } from '$app/stores';
    import {goto} from '$app/navigation';
    import {Button} from "fluent-svelte";
    import GeoJSON from "ol/format/GeoJSON";
    import Container from '$lib/Components/Container.svelte';
    import Line from "$lib/Components/Line.svelte";
    import { fly, slide, blur } from 'svelte/transition';
    import Btn from '$lib/Components/Button.svelte';

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
    let disableDemo   = false;
    let disableDelete = false;

    const isMember = project.members.includes(user.sub);
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

        // const data = new GeoJSON().readFeatures(exportComments ? projectComments : projectData);
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

<div class="panels">

    <div class="info-panel">
      <Container color={colors.redDark} color2={colors.redMediumTransparent}>
				<div class="info-text">
                    <div style="text-align: center">
                        <h1>{project.name}</h1>
                        <p>{project.description}</p>
                    </div>
                    <Line color={colors.redLight}></Line>
          <p> - Welcome to the Projects dashboard. </p>
          <p> - Go to a project to start working on it</p>
          <p> - Below is a list of active members in your orginization</p>
          <p> - You can add new members by clicking on the link to the right</p>
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
                <p>Joined Workers:</p><p>{project.members.length}</p>
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
                        <div class="grid-span" style="margin-top: 12px">
                            <Button on:click={() => handleExport(false)}>Export Features</Button>
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
                        <div class="grid-span" style="margin-top: 12px">
                            <Button on:click={() => handleExport(true)}>Export Comments</Button>
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
            <!-- <div class="button"><Button disabled>Upload</Button></div> -->
            <!-- {#if !disableDemo} -->
            <div class="grid-span">
                <form method="post" action="?/startDemo">
                    <div class="longbutton">
                        <Btn 
                        btnTitle="Use Demo"
                        colorLight={colors.redLight} 
                        colorMedium={colors.redMedium} 
                        colorDark={colors.redDark}
                        btnType="submit"
                        width="60%"
                        ></Btn>
                        <!-- <Button on:click={() => disableDemo = true}>
                            Use Demo
                        </Button> -->
                    </div>
                    <div class="slider-con">
                        <label for="size">Size:</label>
                        <input name="size" type="range" min="1" max="100" bind:value={demoSize} class="slider">
                        <span>{demoSize}</span>
                    </div>
                    <input name="project_id" type="hidden" value={project.id}>
                </form> 
            </div>
            
            <!-- {/if} -->
            
             </div>
            </Container>
            </div>
        {/if}

        <div class="btns-panel">
            <Container color={colors.redDark} color2={colors.redMediumTransparent}>
    
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
        
                {#if isAdmin && features.length > 0}
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
          </Container>
        </div>
        
  </div>

<style>

    .mod-console {
        width: 250px;
        height: fit-content;
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
    }
    .panels {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    .proj-btn{
        display: flex;
    }
    .form-btn {
        display: flex;
    }
    .btns-panel, .info-panel {
        flex: 3;
    }
    
</style>

