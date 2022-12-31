<script>
  /**
	 * @type {any}
	 */
   export let color;
</script>

<div class="line" style="--color:{color};"></div>
<style>
    .line {
        height: 3px;
        width: 100%;
        background-color: var(--color);
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 0;
  }
</style>