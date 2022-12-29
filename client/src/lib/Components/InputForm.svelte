<script>
	// import { enhance } from "$app/forms";

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
            <input class="input-name input" name="first_name" type="text" placeholder="First Name">   
            <input class="input-name input" name="last_name" type="text" placeholder="Last Name"> 
            {:else}
            <h1> Login </h1>
            {/if} 
            <input class="input-email input" name="email" type="text" placeholder="Email">
            <input class="input-password input" name="password" type="password" placeholder="Password">
            {#if formName == "Register"}
            <input class="input-password input" name="confirm_password" type="password" placeholder="Confirm Password">
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
            <button class="btn" type="reset">Reset</button>
            {/if}
            <button class="btn" type="submit">{formName}</button>
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

    .btn {
        width: 50%;
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