<script>
    import { page } from '$app/stores';
</script>



  <div class="error-div">
    <div class="inner-div">
        <h1>{$page.status}: {$page.error?.message}</h1>
        <h1>You tried to access {$page.url.pathname}</h1>
        <h1>This page doesnt exist</h1>
    </div>    
  </div>
  

<style>
    .error-div {  
        border: 5px #1e18444b solid;
        border-radius: 0px;
        margin: 10px 10px 0px 10px;
        padding: 10px;
        display: flex;
        justify-content: center;
    }
    .inner-div {
        display: flex;
        flex-direction: column;
        text-align: center;
    }
</style>