<script lang="ts">
    import { page } from '$app/stores';
    import Button from '$lib/Components/Button.svelte';
    import { goto } from '$app/navigation';
    const { user } = $page.data;
</script>

 <div class="nav-btns">
          <Button 
          btnClick= {() => goto(`/user/${user.sub}/newOrg`)} 
          btnTitle="Create New Organization" 
          width = "100%"
          active={$page.url.pathname.endsWith(`/user/${user.sub}/newOrg`)}
          />
          <Button 
          btnClick= {() => goto(`/user/${user.sub}/settings`)} 
          btnTitle="Settings" 
          width = "100%"
          active={$page.url.pathname.endsWith(`/user/${user.sub}/settings`)}
          />
      </div>

<style>
  
.nav-btns{
    display: flex;
}
</style>

