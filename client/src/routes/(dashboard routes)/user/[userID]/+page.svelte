<script lang="ts">
import type { PageData } from './$types';
import Button from '$lib/Components/Button.svelte';
import { goto } from '$app/navigation';
export let data: PageData;
</script>
<div class="wrapper">
    <Button btnClick= {() => goto(`/user/${data.user.sub}/newOrg`)} btnTitle="Create New Organization" width = "100%"></Button>
    <Button btnClick= {() => goto(`/user/${data.user.sub}/settings`)} btnTitle="Settings" width = "100%"></Button>
</div>

<style>
    .wrapper{
        display: flex;
    }
</style>

