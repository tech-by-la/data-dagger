<script lang="ts">
    import logo from '$lib/assets/img/data-dagger-logo.png';
    import Prompt from "$lib/Components/Prompt.svelte";
    import InputForm from "$lib/Components/InputForm.svelte";
    import Button from "$lib/Components/Button.svelte";
    import { page } from '$app/stores';
    import MdClose from 'svelte-icons/md/MdClose.svelte';

    let registerPromptController = ($page.form?.invalid && $page.form?.register) || false
    function toggleTheRegisterPrompt() {
        registerPromptController ? registerPromptController=false : registerPromptController=true
    }
    let logoutPromptController = false
    function toggleTheLogoutPrompt() {
        logoutPromptController ? logoutPromptController=false : logoutPromptController=true
    }
    let loginPromptController = ($page.form?.invalid && $page.form?.login) || false
    function toggleTheLoginPrompt() {
        loginPromptController ? loginPromptController=false : loginPromptController=true
    }
    let userID = "0";
    if ($page.data.user) {
        userID =$page.data.user.sub
    }


</script>

<div class="navbar-wrapper">

    <div class="logo-name-container">
        <a href="/"><img class="logo" src={logo} alt="goose-logo" width="60px"></a>
        <div class="title-name">
          <h1>Data Dagger</h1>
        </div>
    </div>

    <div class="links-container">
        <div class="links">
            {#if $page.data.user}
                <a href="/user/{userID}" data-sveltekit-preload-data>Profile</a>
                <p> / </p>
                {#if $page.data.user.roles.includes('ADMIN') || $page.data.user.roles.includes("SUPER_ADMIN")}
                    <a href="/admin" data-sveltekit-preload-data>Admin</a>
                    <p> / </p>
                {/if}
            {/if}

            <a href="/" data-sveltekit-preload-data>Home</a>
        </div>
        {#if $page.data.user}
        <Button btnClick={toggleTheLogoutPrompt} btnTitle={"Logout"}></Button>
        {:else}
        <Button btnClick={toggleTheLoginPrompt} btnTitle={"Login"}></Button>
        <Button btnClick={toggleTheRegisterPrompt} btnTitle={"Register"}></Button>
        {/if}
    </div>

</div>

{#if loginPromptController}
    <Prompt toggle={toggleTheLoginPrompt} >
        <Button btnClick={toggleTheLoginPrompt} btnTitle={""}><li class="icon"><MdClose/></li></Button>
       <InputForm formFunction="/login" formName="Login" />
    </Prompt>

{/if}
{#if logoutPromptController}
    <Prompt toggle={toggleTheLogoutPrompt} >
        <Button btnClick={toggleTheLogoutPrompt} btnTitle={""}><li class="icon"><MdClose/></li></Button>
       <InputForm formFunction="/logout" formName="Logout" />
    </Prompt>
{/if}
{#if registerPromptController}
    <Prompt toggle={toggleTheRegisterPrompt}>
        <Button btnClick={toggleTheRegisterPrompt} btnTitle={""}><li class="icon"><MdClose/></li></Button>
        <InputForm formFunction="/register" formName="Register" />
    </Prompt>
{/if}

<style>
    .icon {
        list-style-type: none;
        height: 35px;
        margin: -8px;
    }

.navbar-wrapper {
    height: 80px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* border: 5px #1a1a1a ; */
    border-radius: 0px;
    margin: 0 0;
    background: #060a1d77;
    backdrop-filter: blur(5px)

}
.navbar-wrapper div{
    align-items: center;
}

.logo-name-container, .links-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
}


.links {
    display: flex;
    margin: 0px 15px;
    font-size: 15px;
}

.title-name {
    font-size: 20px;
    margin-left: 20px;
}
a {
    color: inherit;
    font: inherit;
    font-style: inherit;
    font-variant: inherit;
    font-display: inherit;
}
p {
    font-size: 30px;
    margin-left: 10px;
    margin-right: 10px;
}


</style>
