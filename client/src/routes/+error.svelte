<script>
    import { page } from '$app/stores';
	import Container from '$lib/Components/Container.svelte';

    let error = '';
    $: switch ($page.status) {
        case 401:
            error = "Unauthorized"
            break;
        default:
            error = $page.error.message;
    }

</script>

<div class="error-div">
    <Container>
        <div class="inner-div">
            <h1>{$page.status} {error}</h1>
            {#if $page.status === 401}
                <h1>You do not have permission to access the requested resource</h1>
            {:else if $page.status === 500}
                <h1>Oops!</h1>
            {:else}
                <h1>You tried to access {$page.url.pathname}</h1>
                <h1>This page doesnt exist</h1>
            {/if}
        </div>
    </Container>
</div>

<style>
    .error-div {
        display: flex;
        justify-content: center;
        width: 100%;
    }
    .inner-div {
        display: flex;
        flex-direction: column;
        text-align: center;
        width: 400px;
    }
</style>
