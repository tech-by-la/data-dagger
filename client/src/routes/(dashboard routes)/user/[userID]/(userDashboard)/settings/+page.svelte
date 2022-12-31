<script>
    import Button from "$lib/Components/Button.svelte";
    import { page } from "$app/stores"
	import { goto } from "$app/navigation";
    import MdClose from 'svelte-icons/md/MdClose.svelte';
	import { slide } from "svelte/transition";
    const  { user, colors } = $page.data
</script>
<div class="setting-div" in:slide="{{delay: 500, duration: 500}}" out:slide="{{delay: 0, duration: 500}}">
    <Button btnClick= {() => goto(`/user/${user.sub}`)} btnTitle="" width = "50px" colorLight={colors.greenLight} colorMedium={colors.greenMedium} colorDark={colors.greenDark}><div class="icon"><MdClose/></div></Button>
        <div class="content" >
            
            <form method="post" action="?/logoutEverywhere">
                <Button btnType="submit" btnTitle="Logout Everywhere" width = "50%" colorLight={colors.greenLight} colorMedium={colors.greenMedium} colorDark={colors.greenDark}></Button>
            </form>
        
        </div>
</div>


<style>
    .content {
        text-align: center;
    }
    .btn{
    font-size: 20px;
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
