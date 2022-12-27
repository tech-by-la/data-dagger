<script>
    import Button from "$lib/Components/Button.svelte";
    import { page } from "$app/stores"
	import { goto } from "$app/navigation";
    import MdClose from 'svelte-icons/md/MdClose.svelte';
    const  { user } = $page.data
</script>
<Button btnClick= {() => goto(`/user/${user.sub}`)} btnTitle="" width = "50px"><li class="icon"><MdClose/></Button>
<div class="content">
    
    <form method="post" action="?/logoutEverywhere">
        <button class="btn" type="submit">Logout Everywhere</button>
    </form>

</div>

<style>
    .content {
        text-align: center;
    }
    .btn{
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
</style>
