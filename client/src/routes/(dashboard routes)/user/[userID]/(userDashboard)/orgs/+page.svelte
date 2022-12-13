<script lang="ts">
    import type { PageData } from './$types';
    import Button from '$lib/Components/Button.svelte';
    import { goto } from '$app/navigation';
    
    export let data: PageData;
    const userEmail = data.user.email

    const userOrgs = data.userOrgs
    console.log(userOrgs);
    const org1 = userOrgs[0].org_id
    

</script>

<h1>Hello { userEmail }</h1>
<h1>This will show a list of organizations you are a part of</h1>
<h1>There will also be a option to start a new oprginization</h1>

{#each userOrgs as org, i }
<div class="org-wrapper">
    <p>{org.name}</p>
    <Button btnClick= {() => goto(`/org/${org.id}`)} btnTitle={org.name} width = "100%"></Button>
</div>   
{/each}


<Button btnClick= {() => goto(`/user/${data.user.sub}/newOrg`)} btnTitle="Create New Organization" width = "100%"></Button>

<style>
    .org-wrapper{
        border: 5px #1e18444b solid; 
      padding: 10px;
      margin: 0px 10px;
    }
</style>