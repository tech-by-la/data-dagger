<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from '$app/navigation';
    import Button from '$lib/Components/Button.svelte';
    import Container from "$lib/Components/Container.svelte";

    const { organization, isMod, isOwner } = $page.data;
    const hasAccess = isOwner || isMod;

</script>

<div class="org-page-wrapper">
    <div on:click={() => goto(`/org/${organization.id}`)} class="con-1">
        <span id="org-title">
            {organization.name}
        </span>
    </div>
    <div class="con-2">
      <Container width="250px">
        {#if hasAccess}
            <Button
                btnClick={() => goto(`/org/${organization.id}/members`)}
                btnTitle="Members"
                width="100%"
                active={$page.url.pathname.endsWith(`/org/${organization.id}/members`)}
            />
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
        {/if}
        <Button
            btnClick={() => goto(`/org/${organization.id}/projects`)}
            btnTitle="Projects"
            width="100%"
            active={$page.url.pathname.endsWith(`/org/${organization.id}/projects`)}
        />
      </Container>
      <div class="con-2-1">

      </div>
      <div class="con-2-2">
        <slot></slot>
      </div>
      <!-- <div class="con-2-3">right side panel</div> -->
    </div>
    <div class="con-3">Bottom panel</div>
</div>

<style>
    div {
      border: 5px #ffffff solid;
      padding: 10px;
      margin: 0 10px;
    }
    .org-page-wrapper {
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
      border: 0;
    }
    .con-2  {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0;
      border: 0;
    }
    .con-2 div{
      height: 100%;
    }
    .con-2-1 {
      margin-left: 0;
      flex: 1;
      /* height: 100px; */
    }
    .con-2-2 {
      flex: 4;
      margin-right: 0;

    }
    /* .con-2-3 {
      margin-right: 0;
      flex:1;
    } */
    #org-title:hover {
        cursor: pointer;
        text-decoration: underline;
    }
    .con-1 {
      flex: 2;
    }
    .con-2 {
      flex: 6;
    }
    .con-3 {
      flex: 1;
    }

</style>
