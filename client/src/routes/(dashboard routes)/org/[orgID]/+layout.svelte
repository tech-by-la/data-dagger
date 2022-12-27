<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from '$app/navigation';
    import Button from '$lib/Components/Button.svelte';
    import Container from "$lib/Components/Container.svelte";
	import { IconButton } from "fluent-svelte";
	import FaPlus from "svelte-icons/fa/FaPlus.svelte";

    const { organization, isMod, isOwner, user, projects} = $page.data;
    const hasAccess = isOwner || isMod;
		const { members } = organization;

    const formatDate = (unix: number) => {
        let date = new Date(unix);
        if (!unix || isNaN(date.getTime())) return 'Not set';
        return date.toLocaleDateString();
    }

</script>



<div class="org-page-wrapper">
  <Container>
    <div class="top-panel">
      <div class="user-info">
        Logged in as {user.email}
      </div>
  
      <div class="title">
        <h1> - {organization.name} Dashboard - </h1>
  
      </div>
    </div>
  </Container>

  <div class="panels">

    <div class="left-panel">
      <Container>
				<div class="info-text">
          <p> - Welcome to the Projects dashboard. </p>
          <p> - Go to a project to start working on it</p>
          <p> - Below is a list of active members in your orginization</p>
          <p> - You can add new members by clicking on the link to the right</p>
        </div>
        <!-- {#if hasAccess}
					<Button
							btnClick={() => goto(`/org/${organization.id}/members`)}
							btnTitle="Members"
							width="100%"
							active={$page.url.pathname.endsWith(`/org/${organization.id}/members`)}
					/>
					<Button
							btnClick={() => goto(`/org/${organization.id}/invite`)}
							btnTitle="Invite Members"
							width="100%"
							active={$page.url.pathname.endsWith(`/org/${organization.id}/invite`)}
					/>
					<Button
							btnClick={() => goto(`/org/${organization.id}/invite/pending`)}
							btnTitle="Pending Invites"
							width="100%"
							active={$page.url.pathname.endsWith(`/org/${organization.id}/invite/pending`)}
					/>
				{/if}
					<Button
							btnClick={() => goto(`/org/${organization.id}/projects`)}
							btnTitle="Projects"
							width="100%"
							active={$page.url.pathname.endsWith(`/org/${organization.id}/projects`)}
					/> -->
			</Container>
			<Container>
				<div class="member-list">
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
											<!-- This form needs to be updated -->
													<form method="post">
														<button type="submit" class="btn">Remove</button>
															<input name="org_id" type="hidden" value={organization.id}>
															<input name="user_id" type="hidden" value={member.user_id}>
													</form>
											{/if}
									</div>
							</div>
					{/each}
			</div>

			</Container>

    </div>

    <div class="right-panel">
        <Container>
          <slot></slot>
        </Container>
        
        <Container>   
          <div class="proj-cards">
						<div class="proj-cards-title">
								<h1>Projects</h1>
								<div class="line grid-full"></div>
						</div>
            
						{#each projects as proj, i }
							<div class="single-proj-card">

								<div class="proj-title">
									<h2>{proj.name}</h2>
								</div>

								<div class="proj-info">
									<p>Description : {proj.description}</p>
									<p>Status: {proj.status}</p>
									<p>Type: {proj.type}</p>
								</div>

								<div class="proj-nav-btn">
									<Button btnClick= {() => goto(`/project/${proj.id}`)} btnTitle={"Go to"} width = "50%"></Button>
								</div>
            	</div>
            	<div class="line grid-full"></div>
            {/each}

        	</div>
				</Container>     
    </div>
  </div>
    
  
  <!-- <Container>
  <div class="projects-div">
    <h1 class="grid-full">Projects for {organization.name}</h1>

    <div class="add-button">
        <IconButton
            on:click={() => goto(`/org/${organization.id}/projects/create`)}
            style="cursor: pointer"
        >
            <FaPlus/>
        </IconButton>
    </div>

    {#if projects.length < 1}
        <h2 class="grid-full">No projects to show</h2>
    {:else}
        <div class="grid-1">
          <h2>Name</h2>
        </div>
        <div class="grid-2">
         <h2>Description</h2> 
        </div>
        <div class="grid-3">
         <h2>Status</h2>
        </div>
        <div class="grid-4">Type</div>
        <div class="line grid-full"></div>
    {/if}

    {#each projects as project, index} -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- <div class="grid-row" on:click={() => goto(`/project/${project.id}`)}>
            <div class="grid-cell grid-1">{project.name}</div>
            <div class="grid-cell grid-2">{project.description}</div>
            <div class="grid-cell grid-3">{project.status}</div>
            <div class="grid-cell grid-4">{project.type}</div>
        </div>

    {/each}
  </div>
</Container> -->
  <!-- <slot></slot>       -->
</div>

<style>
   
   .top-panel {
    display: flex;
    justify-content: space-around;
    height: 30px;
  }
  .title {
    display: flex;
    align-items: center;
    flex: 2;
    justify-content: center;
    font-size: 15px;

    }
    .projects-div {
        position: relative;
        display: grid;
        grid-template-columns: auto auto auto auto auto auto;
    }
    .grid-row {
        display: contents;
    }

    .grid-row:hover div {
        cursor: pointer;
        background-color: #394c8f;
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
    }
    .grid-5 {
        grid-column: 5;
    }
    .grid-6 {
        grid-column: 6;
    }

    .grid-full {
        grid-column: 1 / span 6;
        padding: 10px;
    }
    .line {
        height: 1px;
        width: 100%;
        background-color: white;
        margin-top: 10px;
        padding: 0;
    }
    .panels {
    display: flex;
    }
    .right-panel{
    flex: 3;
    }
    .left-panel{
    flex: 2;
    }
		.single-proj-card {
    display: flex;
    align-items: center;
  }
  .proj-info, .proj-nav-btn, .proj-title{
    width: 33%;
    text-align: center;
  }

	.member-list {
        position: relative;
        display: grid;
        width: 100%;
        grid-template-columns: auto auto auto 60px;
    }
		.btn {
        color: rgb(255, 255, 255);
        font-size: 20px;
        line-height: 20px;
        padding: 10px;
        /* border-radius: 10px; */
        font-family: 'Oswald';
        font-weight: normal;
        font-style: normal;
        font-variant: normal;
        text-transform: none;
        border: 3px solid #798AC5;
        display: inline-block;
        background: 0;
        margin: 5px;
        /* width: {width}; */
    }

    .btn:hover {
        cursor: pointer;
        background: #798AC5;
    }

    .btn:active {
        background: #144E75;
    }

</style>
