<script lang="ts">
  import ProjectList from './ProjectList.svelte';

  import MemberList from './MemberList.svelte';
  import NavButtons from './NavButtons.svelte'

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
			</Container>
			<MemberList></MemberList>

    </div>

    <div class="right-panel">
        <Container>
          <NavButtons></NavButtons>
          <Line />
          <slot>
            
          </slot>
        </Container>
        
        <ProjectList></ProjectList>   
    </div>
  </div>
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
    .panels {
    display: flex;
    }
    .right-panel{
    flex: 3;
    }
    .left-panel{
    flex: 2;
    }

</style>
