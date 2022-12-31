<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from '$app/navigation';
    import Button from '$lib/Components/Button.svelte';
    import Container from "$lib/Components/Container.svelte";
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

<Container>   
          <div class="proj-cards">
						<div class="proj-cards-title">
								<h1>Projects</h1>
								<Line color={colors.yellowLight}/>
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
									<Button 
                                    btnClick= {() => goto(`/project/${proj.id}`)} 
                                    btnTitle={"Go to"} 
                                    width = "50%"
                                    colorLight={colors.yellowLight} 
                                    colorMedium={colors.yellowMedium} 
                                    colorDark={colors.yellowDark}
                                    ></Button>
								</div>
            	</div>
            	<Line color={colors.yellowLight}/>
            {/each}

        	</div>
				</Container>  

<style>
  
    .single-proj-card {
        display: flex;
        align-items: center;
    }
    .proj-info, .proj-nav-btn, .proj-title{
        width: 33%;
        text-align: center;
    }

</style>

