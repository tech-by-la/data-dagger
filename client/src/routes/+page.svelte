<script> 
import FillerText from "$lib/Components/FillerText.svelte"
import Button from "$lib/Components/Button.svelte";
import Prompt from "$lib/Components/Prompt.svelte";
import InputForm from "$lib/Components/InputForm.svelte";
import PromptController from "$lib/Components/stores/PromptController";

function toggleThePrompt() {
    $PromptController ? $PromptController=false : $PromptController=true
} 
        
</script>

{#if $PromptController}
    <Prompt on:closePrompt={toggleThePrompt}>
       <InputForm/>
       <Button btnClick={toggleThePrompt} btnTitle={"Close"}></Button>
    </Prompt>
{/if}
    
<div class="page-con">
    <div class="main-con">
        <div class="text-con-1">
            <FillerText/>
        </div>
        <div class="text-con-2">
            <FillerText/>
        </div>
        <div class="text-con-3">
            <FillerText/>
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
        border: 1px black solid;
        margin: 10px 10px 0px 10px;
        padding: 10px;
    }
    .page-con {
        border: 1px black solid;
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
    }
</style>



