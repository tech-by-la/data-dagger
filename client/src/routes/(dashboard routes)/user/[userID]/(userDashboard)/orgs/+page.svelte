<script lang="ts">
    import type { PageData } from './$types';
    import Button from '$lib/Components/Button.svelte';
    import { goto } from '$app/navigation';
    
    export let data: PageData;
    const userEmail = data.user.email

    const userOrgs = data.userOrgs
    console.log(userOrgs);
    
    interface Org {
        name: string;
        contact_email: string;
        contact_phone: string;
        }
    let orgArray: Org[] = [
        {
        name: "Bobs Org",
        contact_email: "bob@billy.com",
        contact_phone: "+45 60 77 12 21"
        },
        {
        name: "Johns Org",
        contact_email: "john@jack.com",
        contact_phone: "+45 55 55 12 21"
        },
    ]
</script>

<h1>Hello { userEmail }</h1>
<h1>This will show a list of organizations you are a part of</h1>
<h1>There will also be a option to start a new oprginization</h1>
<p>Your Orgs: {userOrgs}</p>
{#each userOrgs as org, i }
<div class="org-wrapper">
    <h1>{org.id}</h1>
</div>   
{/each}
{#each orgArray as org, i }
<div class="org-wrapper">
    <h1>{org.name}</h1>
    <p>Phone : {org.contact_phone}</p>
    <p>Email : {org.contact_email}</p>
</div>   
{/each}

<Button btnClick= {() => goto(`/user/${data.user.sub}/newOrg`)} btnTitle="Create New Organization" width = "100%"></Button>
