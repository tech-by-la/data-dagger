<script lang="ts">

  import { page } from '$app/stores';
  import Container from '$lib/Components/Container.svelte';
  const { colors } = $page.data



</script>

<Container color={colors.greenDark} color2={colors.greenMediumTransparent}>
        <div class="info-text">
          <p> - These are the organizations you are a part of. </p>
          <p> - Go to an organization dashboard to see available projects</p>
          <p> - To create a new organization click the link</p>
          <p> - To delete an organization (that you are an owner of) please contact Data Dagger Support</p>
        </div>
      </Container>

<style>

  
  .info-text {
    font-size: 20px;
    font-weight: 100;
  }
  



</style>

