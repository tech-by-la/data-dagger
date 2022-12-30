<script lang="ts">
    import Container from '$lib/Components/Container.svelte';
    import { page } from '$app/stores';
	import GoBackBtn from '$lib/Components/GoBackBtn.svelte';

    const { user, project, org} = $page.data
    const { url } = $page;

</script>

<div class="proj-page-wrapper">

  <Container>
    <div class="top-panel">

      <div class="user-info">
        <div class="user">
          <b>User:</b> {user.email}
        </div>
        <div class="org">
          <b>Organization:</b> {org.name}
        </div>
        <div class="project">
          <b>Project:</b> {project.name}
        </div>
      </div>

      <div class="title">
        <h1> -  Dashboard - </h1>
      </div>

      <div class="back-div">
        <GoBackBtn url={url.pathname.endsWith('workzone') ? `/project/${project.id}` : `/org/${org.id}`}></GoBackBtn>
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
    flex: 1;
    justify-content: center;
    font-size: 15px;

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
