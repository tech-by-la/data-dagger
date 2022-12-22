<script lang="ts">
    import Container from '$lib/Components/Container.svelte';
    import { page } from '$app/stores';

    const { user } = $page.data
    
</script>

<Container>
    <div class="top-panel">
      <div class="user-info">
        Logged in as {user.email}
      </div>

      <div class="title">
        <h1>Your Organizations</h1>

      </div>
    </div>
  </Container>
  <slot></slot>