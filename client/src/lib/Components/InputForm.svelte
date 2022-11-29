<script>
	import { enhance } from "$app/forms";

    /**
	 * @type {any}
	 */
     export let formName;
    /**
	 * @type {any}
	 */
     export let formFunction;
</script>

<div class="form-div">
    <form class="form-form" method="POST" action="?/{formFunction}" use:enhance> 
        {#if formName == "Register"}
        <input class="input-name" name="first_name" type="text" placeholder="First Name">   
        <input class="input-name" name="last_name" type="text" placeholder="Last Name"> 
        {/if} 
        <input class="input-email" name="email" type="email" placeholder="Email">
        <input class="input-password" name="password" type="password" placeholder="Password">
        {#if formName == "Register"}
        <input class="input-password" name="confirm_password" type="password" placeholder="Confirm Password">
        {/if}  
        
        <div class="inner-btn-div">
            <button class="btn" type="reset">Reset</button>
            <button class="btn" type="submit">{formName}</button>
        </div>
    </form>    
</div>

<style>
    .form-div, form {
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


    input, .btn, .input-email{
    font-size: 15px;
    line-height: 20px;
    padding: 10px;
    border-radius: 3px; 
    font-family: 'Oswald';
    font-weight: normal;  
    font-style: normal; 
    font-variant: normal; 
    text-transform: none;   
    border: 2px solid #798AC5; 
    display: inline-block;
    color: rgb(255, 255, 255); 
    
    }

    input {
    background:#1e184453;
    margin: 5px;
    width: auto;
    }

    .btn {
    background: 0;
    margin: 5px;
    width: 50%;
    }

    .btn:hover {
        background: #798AC5; 
    }

    .btn:active {
        background: #144E75; 
    } 

</style>