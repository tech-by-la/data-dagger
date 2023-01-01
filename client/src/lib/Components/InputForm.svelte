<script>
	// import { enhance } from "$app/forms";
    import Button from "./Button.svelte";
    import InputField from "./InputField.svelte";

    /**
	 * @type {any}
	 */
     export let formName;
    /**
	 * @type {any}
	 */
     export let formFunction;
</script>

<div class="form-wrapper">
    <form class="form-form" method="POST" action="{formFunction}"> 
        {#if formName != "Logout"}
            {#if formName == "Register"}
            <h1> Register Now</h1>
            <InputField name="first_name" type="text" placeholder="First Name" colorDark="0" ></InputField>
            <InputField name="last_name" type="text" placeholder="Last Name" colorDark="0" ></InputField>
            {:else}
            <h1> Login </h1>
            {/if} 
            <InputField name="email" type="text" placeholder="Email" colorDark="0" ></InputField>
            <InputField name="password" type="password" placeholder="Password" colorDark="0" ></InputField>
            {#if formName == "Register"}
            <InputField name="confirm_password" type="password" placeholder="Confirm Password" colorDark="0" ></InputField>
            <div class="checkbox-div">
                <input class="checkbox" type="checkbox" name="terms">
                <label for="terms"> I agree to all ther terms and conditions</label>
            </div>
            {/if} 
        
            {:else}
            <h1>You are about to logout</h1>
            <h1> are you sure?</h1>
            {/if} 
            <div class="inner-btn-div">
            {#if formName != "Logout"}
            <Button btnType="reset" btnTitle="Reset" width="50%"></Button>
            {/if}
            <Button btnTitle="{formName}" width="50%"></Button>
        </div>

    </form>    
</div>

<style>
    .form-wrapper, form {
        display: flex;
        flex-direction: column;
        border: 2px;
        border-color: black;
        justify-content: space-evenly;
    }
    .inner-btn-div {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    h1 {
        text-align: center;
        margin-top: 0;   
    }

    .checkbox-div {
        display: flex;
        justify-content: center;
        margin: 5px;
    }

    .checkbox {
        display: grid;
        grid-template-columns: 2em auto;
        gap: 0.5em;
    }

</style>