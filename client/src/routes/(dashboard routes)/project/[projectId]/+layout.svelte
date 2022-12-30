<script lang="ts">
    import Container from '$lib/Components/Container.svelte';
    import { page } from '$app/stores';
	import GoBackBtn from '$lib/Components/GoBackBtn.svelte';

    const { user, project, org} = $page.data
    
</script>

<div class="proj-page-wrapper">

  <Container>
    <div class="top-panel">

      <div class="user-info">
        Logged in as {user.email}
      </div>

      <div class="title">
        <h1> - {project.name} Dashboard - </h1>
      </div>

      <div class="back-div">
        <GoBackBtn url ="/org/{org.id}"></GoBackBtn>
      </div>

    </div>
  </Container>

  <slot></slot>
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
  .back-div{
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: center;
    font-size: 15px;
    width: 50%;
    padding: 5px;
  }
  .user-info {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: center;
  }
</style>
