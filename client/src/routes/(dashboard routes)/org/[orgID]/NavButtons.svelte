<script lang="ts">
  import Button from '$lib/Components/Button.svelte';
  import { goto } from '$app/navigation';
  import { page } from "$app/stores";

  const { organization, isMod, isOwner, user, projects} = $page.data;
    const hasAccess = isOwner || isMod;
  </script>

<div class="wrapper">
    {#if hasAccess}
    <Button
        btnClick={() => goto(`/org/${organization.id}/invite`)}
        btnTitle="Invite Members"
        width="100%"
        active={$page.url.pathname.endsWith(`/org/${organization.id}/invite`)}
    />
    <Button
        btnClick={() => goto(`/org/${organization.id}/invite/pending`)}
        btnTitle="Pending Invites"
        width="100%"
        active={$page.url.pathname.endsWith(`/org/${organization.id}/invite/pending`)}
    />
    <Button
        btnClick={() => goto(`/org/${organization.id}/projects/create`)}
        btnTitle="Create Project"
        width="100%"
        active={$page.url.pathname.endsWith(`/org/${organization.id}/projects/create`)}
    />
  {/if}
  
  </div>

<style>
      .wrapper{
          display: flex;
      }
  </style>

