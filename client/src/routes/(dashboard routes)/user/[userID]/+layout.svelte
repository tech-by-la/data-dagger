<script lang="ts">
    import type { LayoutData } from './$types';
    import Button from '$lib/Components/Button.svelte';
    import { goto } from '$app/navigation';
    import Container from '$lib/Components/Container.svelte';

    export let data: LayoutData
    const userOrgs = data.userOrgs
</script>

<div class="user-dashboard-wrapper">
  <Container>
    <div class="top-panel">
      <div class="user-info">
        Logged in as {data.user.email}
      </div>
      
      <div class="title">
        <h1>Your Organizations</h1>
        
      </div>
    </div>
  </Container>

  <div class="panels">
    <div class="left-panel">
      <Container>
        <div class="info-text">
          <p> - These are the organizations you are a part of. </p>
          <p> - Go to an organization dashboard to see avaiabile projects</p>
          <p> - To create a new click the link below to open a create new Organization form</p>
          <p> - To delete a Organization (that you are an owner of) please contact Data Dagger Support</p>
        
        </div>
        
      </Container>
      <Container>
        <slot></slot>
      </Container>
      <Container>
        <h1>Invites</h1>
        
      </Container>
    </div>
    
    
    <div class="right-panel">
    {#each userOrgs as org, i }
      <Container>
      <div class="org-wrapper">
        <p>Name : {org.name}</p>
        <p>Your Role : </p>
        <p>Nr of Members: </p>
        <p>Nr of Projects: </p>
        <Button btnClick= {() => goto(`/org/${org.id}`)} btnTitle={"Go to " + org.name + " dashboard page"} width = "50%"></Button>
      </div>  
      </Container> 
    {/each}
    </div>

    
  </div>
  
    
    <!-- <div class="con-2">
      <div class="con-2-1">
        <Button btnClick= {() => goto(`/user/${data.user.sub}/orgs`)} btnTitle="Organizations" width = "100%"></Button>
        <Button btnClick= {() => goto(`/user/${data.user.sub}/projects`)} btnTitle="Projects" width = "100%"></Button>
        <Button btnClick= {() => goto(`/user/${data.user.sub}/settings`)} btnTitle="Settings" width = "100%"></Button>
      </div>
      <div class="con-2-2">
        <slot></slot>
      </div> -->
      <!-- <div class="con-2-3">right side panel</div> -->
    <!-- </div> -->
    
  </div>

  <style>
    
     .title {
    display: flex;
    align-items: center;
    flex: 2;
    justify-content: center;
    font-size: 15px;
    
    }
    .user-info {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: center;
    }

    .info-text {
    font-size: 20px;
    font-weight: 100;
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

  </style>
