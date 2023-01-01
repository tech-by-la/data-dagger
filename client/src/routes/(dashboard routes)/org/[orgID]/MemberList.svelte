<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from '$app/navigation';
    import Button from '$lib/Components/Button.svelte';
    import Container from "$lib/Components/Container.svelte";
	import { IconButton } from "fluent-svelte";
	import FaPlus from "svelte-icons/fa/FaPlus.svelte";
    import Line from "$lib/Components/Line.svelte";

    const { organization, isMod, isOwner, user, projects, colors} = $page.data;
    const hasAccess = isOwner || isMod;
	const { members } = organization;

    const formatDate = (unix: number) => {
        let date = new Date(unix);
        if (!unix || isNaN(date.getTime())) return 'Not set';
        return date.toLocaleDateString();
    }

</script>

<Container color={colors.yellowDark} color2={colors.yellowMediumTransparent}>
				<div class="member-list">
					<h2 class="grid-full">Members in {organization.name}</h2>
			
					<div class="grid-1">Email:</div>
					<div class="grid-2">Name:</div>
					<div class="grid-3">Role:</div>
					<div class="grid-4"></div>
			
					<div class="grid-full"> <Line color={colors.yellowLight}/> </div>
			
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
                                                        <Button  
                                                            btnTitle="Remove" 
                                                            colorLight={colors.yellowLight} 
                                                            colorMedium={colors.yellownMedium} 
                                                            colorDark={colors.yellowDark}
                                                            >
                                                        </Button>
															<input name="org_id input" type="hidden" value={organization.id}>
															<input name="user_id input" type="hidden" value={member.user_id}>
													</form>
											{/if}
									</div>
							</div>
              <div class="grid-full"> <Line color={colors.yellowLight}/> </div>
					{/each}
			</div>

			</Container>

<style>
   
  
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
    }

    .grid-full {
        grid-column: 1 / span 6;
        padding: 10px;
    }
    

	.member-list {
        position: relative;
        display: grid;
        width: 100%;
        grid-template-columns: auto auto auto 60px;
    }

</style>

