<script>

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
    <form class="form-form" method="POST" action="?/{formFunction}">                  
        <input class="input-name" name="name" type="text" placeholder="Name">                    
        <input class="input-email" name="email" type="email" placeholder="Email">
        <input class="input-password" name="password" type="password" placeholder="Password">
        <button class="btn" type="submit">{formName}</button>
        <button class="btn" type="reset">Reset</button>
    </form>    
</div>

<style>
    .form-div, form {
        display: flex;
        flex-direction: column;
        border: 2px;
        border-color: black;
        padding: 20px;
        justify-content: space-evenly;
    }

    input {
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
    background: rgba(0, 0, 0, 0.2);
    margin: 5px;
    }


    .btn {
    color: rgb(255, 255, 255);
    font-size: 20px;
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
    background: 0;
    margin: 5px;
}

.btn:hover {
    background: #798AC5; 
}

.btn:active {
    background: #144E75; 
} 
</style>