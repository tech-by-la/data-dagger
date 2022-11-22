<script>
import Prompt from "$lib/Components/Prompt.svelte";
import InputForm from "./InputForm.svelte";
import Button from "./Button.svelte";
import PromptController from "./stores/PromptController";
import { PersonPicture } from 'fluent-svelte'
import { Space } from '@svelteuidev/core';




const imgUrl = new URL('/static/images/data-dagger-logo.png', import.meta.url).href

function toggleThePrompt() {
    $PromptController ? $PromptController=false : $PromptController=true
}

</script>

<div class="navbar-container">

    <div class="logo-name-container">
        <PersonPicture src={imgUrl}/>
        <!-- <img class="logo" src={imgUrl} alt="goose-logo" width="70px"> -->
        <Space w="sm"/>
        <div class="title-name">Data Dagger</div>
    </div>

    <div class="links-container">

        <div class="links">
            <a href="Dashboard">Dashboard</a>
            <p> / </p>
            <a href="QA-workzone">QA-workzone</a>
            <p> / </p>
            <a href="Some Other Thing">Some Other Thing</a>
        </div>

        <Button btnClick={toggleThePrompt} btnTitle={"Login"}></Button>

    </div>


</div>

{#if $PromptController}
    <Prompt >
       <InputForm/>
       <Button btnClick={toggleThePrompt} btnTitle={"Close"}></Button>
    </Prompt>
{/if}

<style>
.navbar-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    border: 2px #798AC5 solid;
    border-radius: 10px;
    margin: 0 10px;
    top: 10;
    
}
.navbar-container div{
    border: 1px black solid;
    align-items: center;
    

}

.logo-name-container, .links-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
}
.logo {
    margin-right: 10px;
}

.links {
    display: flex;
    margin: 0px 15px;
    font-size: 20px;
}

.title-name {
    font-size: 50px;
}


</style>