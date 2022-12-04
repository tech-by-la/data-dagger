<script>
    import logo from '$lib/assets/img/data-dagger-logo.png';
    import Prompt from "$lib/Components/Prompt.svelte";
    import InputForm from "$lib/Components/InputForm.svelte";
    import Button from "$lib/Components/Button.svelte";

    let navPromptController = false
    function toggleThePrompt() {
        navPromptController ? navPromptController=false : navPromptController=true
    }

</script>

<div class="navbar-wrapper">

    <div class="logo-name-container">
        <a href="/"><img class="logo" src={logo} alt="goose-logo" width="100px"></a>
        <div class="title-name">Data Dagger</div>
    </div>

    <div class="links-container">
        <div class="links">
            <a href="/project/1" data-sveltekit-preload-data>Project Dashboard</a>
            <p> / </p>
            <a href="/qa-workzone" data-sveltekit-preload-data>QA-workzone</a>
            <p> / </p>
            <a href="/" data-sveltekit-preload-data>Home</a>
        </div>
        <Button btnClick={toggleThePrompt} btnTitle={"Login"}></Button>
    </div>

</div>

{#if navPromptController}
    <Prompt toggle={toggleThePrompt} >
       <InputForm formFunction="login" formName="Login" />
       <Button btnClick={toggleThePrompt} btnTitle={"Close"}></Button>
    </Prompt>
{/if}

<style>
.navbar-wrapper {
    height: 80px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    border: 5px #1e184453 ;
    border-radius: 0px;
    margin: 0 0;
    /* top: 10; */
    background: #1e184453;

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
/* .logo {
    margin-right: 10px;
} */

.links {
    display: flex;
    margin: 0px 15px;
    font-size: 20px;
}

.title-name {
    font-size: xx-large;
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
    margin-left: 20px;
    margin-right: 20px;
}


</style>
