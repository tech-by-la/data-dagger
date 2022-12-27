<script lang="ts">
    import { page } from '$app/stores';
    import Button from '$lib/Components/Button.svelte';
    import { goto } from '$app/navigation';
    import Container from '$lib/Components/Container.svelte';
    import {IconButton} from "fluent-svelte";
    import Line from '$lib/Components/Line.svelte';

    const { userOrgs, invites, user } = $page.data;
</script>

<div class="user-dashboard-wrapper">
  <Container>
    <div class="top-panel">
      <div class="user-info">
        Logged in as {user.email}
      </div>

      <div class="title">
        <h1> - Organizations Dashboard - </h1>

      </div>
      <div class="empty-div">
        <!-- For spacing title div corectly -->
      </div>
    </div>
  </Container>

  <div class="panels">
    <div class="left-panel">
      <Container>
        <div class="info-text">
          <p> - These are the organizations you are a part of. </p>
          <p> - Go to an organization dashboard to see available projects</p>
          <p> - To create a new click the link below to open a create new Organization form</p>
          <p> - To delete a Organization (that you are an owner of) please contact Data Dagger Support</p>
        </div>
      </Container>
      
      <Container>
        <h1>Invites</h1>
        
        {#if invites.length < 1}
          <h2>No invites to show</h2>
        {:else}
        <Line/>
          {#each invites as invite, index}
            <div class="invite">
              <p>{invite.organization_name} {invite.sent_at.toLocaleDateString()}</p>
              <form method="post" action={`/user/${user.sub}/handle-invite?/accept`}>
                <button type="submit" class="btn">Accept</button>
                <input name="org_id" type="hidden" value={invite.organization_id}>
              </form>
              <form method="post" action={`/user/${user.sub}/handle-invite?/decline`}>
                <button type="submit" class="btn">Decline</button>
                <input name="org_id" type="hidden" value={invite.organization_id}>
              </form>
            </div>
            <Line/>
          {/each}
        {/if}
      </Container>
    </div>

    <div class="right-panel">

      <Container>
        <slot></slot>
      </Container>
    
      <Container>   
        <div class="org-cards">
          {#if userOrgs.length < 1}
          <h2>No Organizations yet</h2>
          {:else}
            <div class="org-cards-title">
                <h1>Organizations</h1>
                <!-- <Line/> -->
                <div class="line"></div>
            </div>
            
            {#each userOrgs as org, i }
              <div class="single-org-card">
                <div class="org-title">
                  <h2>{org.name}</h2>
                </div>
                <div class="org-info">
                  <p>Your Role : {org.members.find(m => m.user_id === user.sub).org_role_id}</p>
                  <p>Nr of Members: {org.members.length}</p>
                  <p>Nr of Projects: {org.projectCount}</p>
                </div>
                <div class="org-nav-btn">
                  <Button btnClick= {() => goto(`/org/${org.id}`)} btnTitle={"Go to"} width = "50%"></Button>
                </div>
              </div>
              <!-- <Line/> -->
              <div class="line"></div>
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
  .invite {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .empty-div{
    flex: 1;
  }
  .line {
        height: 2px;
        width: 100%;
        background-color: #798AC5;
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 0;
  }
  .single-org-card {
    display: flex;
    align-items: center;
  }
  .org-info, .org-nav-btn, .org-title{
    width: 33%;
    text-align: center;
  }

</style>
