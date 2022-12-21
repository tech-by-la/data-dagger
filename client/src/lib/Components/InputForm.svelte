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
            <input class="input-name" name="first_name" type="text" placeholder="First Name">   
            <input class="input-name" name="last_name" type="text" placeholder="Last Name"> 
            {:else}
            <h1> Login </h1>
            {/if} 
            <input class="input-email" name="email" type="text" placeholder="Email">
            <input class="input-password" name="password" type="password" placeholder="Password">
            {#if formName == "Register"}
            <input class="input-password" name="confirm_password" type="password" placeholder="Confirm Password">
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
    }


    input, .btn{
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
    
    }

    input {
    background:#1e1844ab;
    margin: 5px;
    width: auto;
    border: 2px solid #798AC5; 
    }
    input:focus{
        background: #798AC5; 
        outline: 5px solid #1e1844ab;
        color: #ffffff
    }

    .btn {
    background: 0;
    margin: 5px;
    width: 50%;
    border: 3px solid #798AC5; 
    /* border-radius: 10px; */
    }

    .btn:hover {
        background: #798AC5; 
    }

    .btn:active {
        background: #144E75; 
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