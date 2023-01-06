<script lang="ts">
    import Button from "$lib/Components/Button.svelte";
    import Container from "$lib/Components/Container.svelte";
    import Prompt from "$lib/Components/Prompt.svelte";
    import InputForm from "$lib/Components/InputForm.svelte";
    import { page } from "$app/stores";
    import MdClose from 'svelte-icons/md/MdClose.svelte';
	import { slide, blur } from "svelte/transition";
	import { goto } from "$app/navigation";

    const { user } = $page.data
    const pageText = $page.data.text

    let pagePromptController = false;
    function toggleThePrompt() {
        pagePromptController ? pagePromptController=false : pagePromptController=true
    }

</script>

{#if pagePromptController}
    <Prompt toggle={toggleThePrompt}>
        <div class="xBtn">
        <Button btnClick={toggleThePrompt} btnTitle={""} width="50px"><div class="icon"><MdClose/></div></Button>
        </div>
        <InputForm formFunction="/register" formName="Register" />

    </Prompt>
{/if}

<div class="page-con" in:slide="{{delay: 500, duration: 500}}" out:blur="{{delay: 0, duration: 500}}">

    <div class="main-con">
        <Container>
            <h1>{pageText.introText}</h1>
            <p>{pageText.aboutText1}</p>
            <p>{pageText.aboutText2}</p>
            <p>{pageText.aboutText3}</p>
        </Container>

        <Container>
            <h1>{pageText.howToText1}</h1>
            <p>{pageText.howToText2}</p>
            <p>{pageText.howToText3}</p>
            <p>{pageText.howToText4}</p>
        </Container>
    </div>

    <div class="side-con">
        <Container>
            {#if user}
            <h1>Hello {user.first_name}</h1>
            <p>Navigate to the User Dashboard to get started!</p>
            <div class="button-con">
                <Button btnClick ={() => goto(`/user/${user.sub}`)} btnTitle="Go to User Dashboard"></Button>
                </div>
            {:else}
            <h1>Excited?</h1>
            <p>Well then get started right away. register</p>
            <div class="button-con">
             <Button btnClick ={toggleThePrompt} btnTitle="Get Started"></Button>
             </div>
            {/if}

        </Container>
    </div>

</div>

<style>

    .button-con{
        margin: 10px 10px 0px 10px;
        padding: 10px;
    }
    .page-con {
        display: flex;
        flex-direction: row;
    }
    .main-con{
        flex: 2
    }
    .side-con{
        flex: 1
    }
    .button-con{
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    .map-con {
        display: flex;
        border: 5px #1e18444b solid;
        border-radius: 0px;
        margin: 10px 10px 0px 10px;
    }
    .map-right-panel, .map-left-panel {
        width: 15%;
        display: flex;
        justify-content: space-around;
        flex-direction: column;


    }
    #map-wraper {
        margin: 0px;
        border: 0;
        width: 70%;
        height: 400px;
    }
</style>



