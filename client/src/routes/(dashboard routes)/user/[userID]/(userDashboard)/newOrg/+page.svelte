<script lang="ts">
	import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import Button from '$lib/Components/Button.svelte';
    import MdClose from 'svelte-icons/md/MdClose.svelte';

    const { user } = $page.data;
    let userEmail = user.email
</script>

<div class="form-wrapper">
    <Button btnClick= {() => goto(`/user/${user.sub}`)} btnTitle="" width = "50px"><li class="icon"><MdClose/></Button>
    <form class="form-form" method="POST" action="?/newOrg">
            <h1> Create New Organization</h1>
            <input class="input-name input" name="name" type="text" placeholder="Organization Name">
            <input class="input-name input" name="contact_phone" type="text" placeholder="Contact Phone">
            <input class="input-email input" name="contact_email" type="text"  placeholder="Contact Email">
            <div class="checkbox-div">
                <input class="checkbox" type="checkbox" name="terms">
                <label for="terms"> I agree to terms and conditions</label>
            </div>

            <div class="inner-btn-div">
            <button class="btn" type="reset">Reset</button>
            <button class="btn" type="submit">Create</button>
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
    .btn {
        font-size: 20px;
    }
    input {
        font-size: 15px;
    }


    input, .btn{
    
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
