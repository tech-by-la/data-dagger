<script lang="ts">
    import FillerText from "$lib/Components/FillerText.svelte"
    import Button from "$lib/Components/Button.svelte";
    import Prompt from "$lib/Components/Prompt.svelte";
    import InputForm from "$lib/Components/InputForm.svelte";
    import { page } from "$app/stores";

    const text = $page.data.fillerText
    const text2 = $page.data.fillerText2
    const text3 = $page.data.fillerText3

    const user = $page.data.user?.email

    let pagePromptController = false;
    function toggleThePrompt() {
        pagePromptController ? pagePromptController=false : pagePromptController=true
    }

</script>

{#if pagePromptController}
    <Prompt toggle={toggleThePrompt}>
        <InputForm formFunction="/register" formName="Register" />
        <Button btnClick={toggleThePrompt} btnTitle={"Close"}></Button>
    </Prompt>
{/if}

<div class="page-con">

    <div class="main-con">
        <div class="text-con-1">
            {user}
        </div>
        <div class="text-con-2">
            {text2}
        </div>
        <div class="text-con-3">
            {text3}
        </div>
        <div class="text-con-4">
            <FillerText/>
        </div>
        <div class="text-con-5">
            <FillerText/>
        </div>
    </div>

    <div class="side-con">
        <div class="text-con-6">
            <FillerText/>
        </div>
        <div class="button-con">
            <Button btnClick ={toggleThePrompt} btnTitle="Get Started"></Button>
        </div>
    </div>

</div>





<style>
    .main-con div, .side-con div{
        border: 5px #1e18444b solid;
        border-radius: 0px;
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
</style>



