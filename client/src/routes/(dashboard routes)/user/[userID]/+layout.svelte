<script lang="ts">
  import Text from './Text.svelte';


  import { page } from '$app/stores';
  import Button from '$lib/Components/Button.svelte';
  import { goto } from '$app/navigation';
  import Container from '$lib/Components/Container.svelte';
  import {IconButton} from "fluent-svelte";
  import Line from '$lib/Components/Line.svelte';   
  import NavButtonsUser from './NavButtonsUser.svelte';
	import GoBackBtn from '$lib/Components/GoBackBtn.svelte';
  import { fly, slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
	const { userOrgs, invites, user } = $page.data;

</script>

<div class="user-dashboard-wrapper" in:slide="{{delay: 500, duration: 500}}" out:slide="{{delay: 0, duration: 500}}">
  <Container>
    <div class="top-panel">
      <div class="user-info" >
        <div class="user">
          <b> User: </b> {user.email} 
        </div>
      </div>                 
      <div class="title">
        <h1> - User Dashboard - </h1>
      </div>
      <div class="back-div">
        <GoBackBtn url ="/"></GoBackBtn>
      </div>
    </div>
  </Container>

  <div class="panels">
    <div class="left-panel">
      <Text></Text>
      
      <Container>
        <h1>Invites</h1>
        
        {#if invites.length < 1}
          <h2>No invites to show</h2>
        {:else}
        <Line/>
          {#each invites as invite, index}
            <div class="invite">
              <div class="invite-info">
                <p>{invite.organization_name} {invite.sent_at.toLocaleDateString()}</p>
              </div>
              <div class="invite-accept">
                <form method="post" action={`/user/${user.sub}/handle-invite?/accept`}>
                  <button type="submit" class="btn">Accept</button>
                  <input name="org_id" type="hidden" value={invite.organization_id}>
                </form>
              </div>
              <div class="invite-decline">
                <form method="post" action={`/user/${user.sub}/handle-invite?/decline`}>
                  <button type="submit" class="btn">Decline</button>
                  <input name="org_id" type="hidden" value={invite.organization_id}>
                </form>
              </div>
              
            </div>
            <Line/>
          {/each}
        {/if}
      </Container>
    </div>

    <div class="right-panel">

      <Container>
        <NavButtonsUser />
        <Line />
        <div class="tabs" transition:fly="{{delay: 250, duration: 250, x: 0, y: 500, opacity: 0.5}}" >
          <slot></slot>
        </div>
        
      </Container>
    
      <Container>   
        <div class="org-cards">
          {#if userOrgs.length < 1}
          <h2>No Organizations yet</h2>
          {:else}
            <div class="org-cards-title">
                <h1>Organizations</h1>
                <Line/>
                
            </div>
            
            {#each userOrgs as org, i }
              <div class="single-org-card">
                <div class="org-title">
                  <h2>{org.name}</h2>
                </div>
                <div class="org-info">
                  <p>Your Role : {org.members.find( m => m.user_id === user.sub).org_role_id}</p>
                  <p>Nr of Members: {org.members.length}</p>
                  <p>Nr of Projects: {org.projectCount}</p>
                </div>
                <div class="org-nav-btn">
                  <Button btnClick= {() => goto(`/org/${org.id}`)} btnTitle={"Go to"} width = "50%"></Button>
                </div>
              </div>
              <Line/>
              
            {/each}
          {/if}

        </div>
      </Container> 

    </div>
  </div>
</div>

<style>

  .title {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: center;
    font-size: 15px;
  }
  .user-info {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: left;
  }
  .top-panel {
    display: flex;
    justify-content: space-around;
    height: 30px;
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
  .invite {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  
  .single-org-card {
    display: flex;
    align-items: center;
  }
  .org-info, .org-nav-btn, .org-title, .invite-info, .invite-decline, .invite-accept{
    flex: 1;
    text-align: center;
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




</style>
