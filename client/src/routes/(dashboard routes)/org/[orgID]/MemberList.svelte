<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from '$app/navigation';
    import Button from '$lib/Components/Button.svelte';
    import Container from "$lib/Components/Container.svelte";
	import { IconButton } from "fluent-svelte";
	import FaPlus from "svelte-icons/fa/FaPlus.svelte";
    import Line from "$lib/Components/Line.svelte";

    const { organization, isMod, isOwner, user, projects} = $page.data;
    const hasAccess = isOwner || isMod;
		const { members } = organization;

    const formatDate = (unix: number) => {
        let date = new Date(unix);
        if (!unix || isNaN(date.getTime())) return 'Not set';
        return date.toLocaleDateString();
    }

</script>

<Container>
				<div class="member-list">
					<h2 class="grid-full">Members in {organization.name}</h2>
			
					<div class="grid-1">Email:</div>
					<div class="grid-2">Name:</div>
					<div class="grid-3">Role:</div>
					<div class="grid-4"></div>
			
					<div class="grid-full"> <Line /> </div>
			
					<!--  List of Members  -->
					{#each members as member}
							<div class="grid-row">
									<div class="grid-cell grid-1">{member.user.email}</div>
									<div class="grid-cell grid-2">{`${member.user.first_name} ${member.user.last_name}`}</div>
									<div class="grid-cell grid-3">{member.org_role_id}</div>
									<div class="grid-cell grid-4">
											{#if isOwner && member.org_role_id !== 'OWNER'}
											<!-- The form action /members needs to be moved to (actions) folder -->
													<form method="post" action="/members">
														<button type="submit" class="btn">Remove</button>
															<input name="org_id" type="hidden" value={organization.id}>
															<input name="user_id" type="hidden" value={member.user_id}>
													</form>
											{/if}
									</div>
							</div>
              <div class="grid-full"> <Line /> </div>
					{/each}
			</div>

			</Container>

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

    /* .grid-row:hover div {
        cursor: pointer;
        background-color: #394c8f;
    } */

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

