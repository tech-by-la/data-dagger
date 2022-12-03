<script>
    import { page } from '$app/stores';
</script>

<div class="footer-wrapper">
    <div class="text-div">
        Website Created by "Tech by LA" - {$page.data.user}
    </div>
    
</div>
    



<style>
    .text-div {
    font-size: 15px;
        
        
    }
    .footer-wrapper {
    display: flex;
    justify-content: space-evenly;
    margin-top: 10px;
    background: #1e184453;
    text-align: center;
    align-items: center;
    height: 30px
    
    
}
    
</style>