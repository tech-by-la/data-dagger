<script lang="ts">
    import type { PageData } from './$types';
    import Button from '$lib/Components/Button.svelte';
    import { goto } from '$app/navigation';
    
    export let data: PageData;
    const userEmail = data.user.email
</script>

<h1>Hello { userEmail }</h1>
<h1>This will show a list of organizations you are a part of</h1>
<h1>There will also be a option to start a new oprginization</h1>
<Button btnClick= {() => goto(`/user/${data.user.sub}/newOrg`)} btnTitle="Create New Organization" width = "100%"></Button>
