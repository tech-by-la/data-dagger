<script >
        /**
     * @type {any}
     */
    export let inputClass = null;
    /**
	 * @type {any}
	 */
     export let name = null;
    /**
	 * @type {any}
	 */
    export let type = null;
    /**
	 * @type {any}
	 */
    export let placeholder = null;
    export let colorLight = '#798AC5'
    export let colorMedium = '#1e1844ab'
    export let colorDark = '#43448d'

</script>


<input class="{inputClass}" name="{name}" type="{type}" placeholder="{placeholder}" style="--color1:{colorLight};--color2:{colorMedium};--color3:{colorDark};">

<style>

input {
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
    background:var(--color3);
    margin: 5px;
    width: auto;
    border: 2px solid var(--color1); 
    }
input:focus{
    background: var(--color2); 
    outline: 0;
    color: #ffffff;
}

</style>

