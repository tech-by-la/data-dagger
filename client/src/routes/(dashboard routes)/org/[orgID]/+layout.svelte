<script lang="ts">
	
  import ProjectList from './ProjectList.svelte';

  import MemberList from './MemberList.svelte';
  import NavButtons from './NavButtons.svelte'
  import { fly, slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

    import { page } from "$app/stores";
    import { goto } from '$app/navigation';
    import Button from '$lib/Components/Button.svelte';
    import Container from "$lib/Components/Container.svelte";
	  import { IconButton } from "fluent-svelte";
	  import FaPlus from "svelte-icons/fa/FaPlus.svelte";
    import Line from "$lib/Components/Line.svelte";
	import GoBackBtn from '$lib/Components/GoBackBtn.svelte';
	import { onMount } from 'svelte';

    const { organization, isMod, isOwner, user, projects, colors} = $page.data;
    const hasAccess = isOwner || isMod;
		const { members } = organization;

    const formatDate = (unix: number) => {
        let date = new Date(unix);
        if (!unix || isNaN(date.getTime())) return 'Not set';
        return date.toLocaleDateString();
    }
    // export let orgTransition: boolean = true
    
    // let nav = () => {
    //   orgTransition=false;
    //   goto(`/user/${user.sub}`)

    // }

</script>



<div class="org-page-wrapper" in:fly="{{delay: 500, duration: 500, x: -2000, y: 0, opacity: 0.5}}" out:slide="{{delay: 0, duration: 500}}">
  <Container>
    <div class="top-panel">
      <div class="user-info" >
        <div class="user">
          <b style="color: var(--greenLight);">User:</b> {user.email} 
        </div>
        
        <div class="org">
          <b style="color: var(--yellowLight);">Organization:</b> {organization.name}
        </div>
        
      </div>
  
      <div class="title">
        <h1> <b style="color: var(--yellowLight);">-</b> Organization Dashboard <b style="color: var(--yellowLight);">-</b> </h1>
      </div>
      <div class="back-div">
        <Button 
          btnClick= {() => goto(`/user/${user.sub}`)} 
          btnTitle="Back" 
          colorLight={colors.yellowLight} 
          colorMedium={colors.yellowMedium} 
          colorDark={colors.yellowDark}
          >
        </Button>
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
          <Line color={colors.yellowLight}/>
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
    flex: 1;
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
    justify-content: left;
  }
  .user-info div{
    padding-right: 10px;
  }

</style>
