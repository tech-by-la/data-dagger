<script lang="ts">
    import {IconButton, ProgressRing} from "fluent-svelte";
    import FaPlus from "svelte-icons/fa/FaPlus.svelte";
    import FaMinus from "svelte-icons/fa/FaMinus.svelte";
    import { slide } from 'svelte/transition';
    import {page} from "$app/stores";
	import Button from "$lib/Components/Button.svelte";
	import { goto } from "$app/navigation";
    import MdClose from 'svelte-icons/md/MdClose.svelte';
	import InputField from "$lib/Components/InputField.svelte";

    let nextId = 0;
    let { organization, colors } = $page.data

    let loading = false;
    let selector = [{id: nextId++, email: '', error: null}];
    $: emails = selector.map(s => s.email);

    let response;
    if ($page.form) response = $page.form.response;

    if (response && response.invalid) {
        selector = [...response.invalid.map(i => { return {id: nextId++, email: i, error: 'invalid'} })];
    }

    const handleAddInput = () => setTimeout(() => selector = [...selector, {id: nextId++, email: '', error: null}]);
    const handleRemoveInput = (index:number) => { selector.splice(index, 1); selector = selector};
    const handleReset = () => selector = [{id: nextId++, email: '', error: null}];
    const focus = (e: HTMLInputElement) => e.focus();
</script>

    <div class="invite-members-div" in:slide="{{delay: 500, duration: 500}}" out:slide="{{delay: 0, duration: 500}}">
        <Button 
        btnClick= {() => goto(`/org/${organization.id}`)} 
        btnTitle="" 
        width = "50px"
        colorLight={colors.yellowLight} 
        colorMedium={colors.yellowMedium} 
        colorDark={colors.yellowDark}
        >
            <div class="icon">
                <MdClose/>
            </div>
        </Button>

        <div class="title">
            <h1>Invite Members</h1>
        </div>
        

        {#each selector as email, index (email.id)}

            <div class="email-div" transition:slide|local>
                    <Button 
                    btnClick={() => handleRemoveInput(index)} 
                    btnTitle={""}
                    colorLight={colors.yellowLight} 
                    colorMedium={colors.yellowMedium} 
                    colorDark={colors.yellowDark}
                    width="50px"
                    >
                        <div class="icon">
                            <FaMinus />
                        </div>
                    </Button>
                <input type="email" placeholder="E-mail address" bind:value={email.email} >
            </div>
            {#if email.error === 'invalid'}
                <div class="error">Invalid email</div>
            {/if}
            
        {/each}

        <div class="add-email-div">
            <Button 
                btnClick={handleAddInput} 
                btnTitle={""}
                colorLight={colors.yellowLight} 
                colorMedium={colors.yellowMedium} 
                colorDark={colors.yellowDark}
                width="80px"
                >
                <div class="icon">
                    <FaPlus/>
                </div>
                </Button>
        </div>
        
        <div class="form-div">
            <form method="post">
                <input name="emails" type="hidden" bind:value={emails}>
                <div class="buttons">
                    <Button 
                        btnClick={handleReset} 
                        btnTitle={"Reset"} 
                        width="40%"
                        colorLight={colors.yellowLight} 
                        colorMedium={colors.yellowMedium} 
                        colorDark={colors.yellowDark}
                        >
                    </Button>
                    <Button 
                        btnClick={() => loading = true} 
                        btnTitle={"Submit"} 
                        width="40%"
                        colorLight={colors.yellowLight} 
                        colorMedium={colors.yellowMedium} 
                        colorDark={colors.yellowDark}
                        >
                    </Button>
                </div>
            </form>
        </div>
    

        {#if loading}
            <div class="loading-div">
                <ProgressRing size={60}/>
            </div>
        {/if}
    </div>

<style>
    .loading-div {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 25%;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #000000B3;
    }


    h1 {
        text-align: center;
        margin-top: 0;
    }

    .error {
        margin: 0 0 20px 40px;
        color: red;
    }
    .buttons {
        display: flex;
        width: 100%;
        justify-content: space-around;
    }
    .add-email-div {
        display: flex;
        justify-content: center;
    }

    .email-div {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    input {
    font-size: 15px;
    line-height: 20px;
    padding: 10px;
    font-family: 'Oswald';
    font-weight: normal;  
    font-style: normal; 
    font-variant: normal; 
    text-transform: none;   
    display: inline-block;
    color: rgb(255, 255, 255);
    background:0;
    margin: 5px;
    border: 2px solid var(--yellowLight); 
    height: 20px;
    width: 80%;
    }
input:focus{
    background: var(--yellowMediumTransparent); 
    outline: 0;
    color: #ffffff;
}
    
   

    
    

</style>
