<script>
  /**
 * @type {any}
 */
    export let btnClick = null;
    export let btnTitle = '';
    export let width = "auto"
    export let active = false;
    export let colorLight = '#798AC5'
    export let colorMedium = '#43448d'
    export let colorDark = '#282158'
    export let btnType = "submit"
</script>

  <button type="{btnType}" class="{active ? 'active' : 'button'}" style="width:{width};--color1:{colorLight};--color2:{colorMedium};--color3:{colorDark};" on:click={btnClick}><slot/>
    <div id="circle" style ="--color1:{colorLight};"></div>
    <p class="text"> {btnTitle} </p>
    </button>



<style>
    
    .button .text {
      position: relative;
      transition: all .45s ease-Out;
    }

    #circle {
      width: 0%;
      height: 0%;
      opacity: 0;
      line-height: 20px;
      border-radius: 50%;
      background: var(--color1);
      position: absolute;
      transition: all .25s ease-Out;
    }

    .button:hover #circle {
      width: 150%;
      height: 150%;
      opacity: 0.5;
      
    }

    .button, .active{

      display: inline-flex;
      height: 40px;
      width: 150px;
      border: 2px solid var(--color1);
      margin: 20px;
      padding: 6px;
      color: #BFC0C0;
      text-decoration: none;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: 0;
      border-radius: 15px;
      cursor: pointer;
    }
    .button {
      position: relative;
      overflow: hidden;

    }
    .active {
      background: var(--color2);
      position: relative;
      overflow: hidden;
    }
    .text {
      color: rgb(255, 255, 255);
      font-size: 20px;
      line-height: 20px;
      padding: 10px;
      font-family: 'Oswald';
      font-weight: normal;
      font-style: normal;
      font-variant: normal;

    }
    .button:hover {
      /* border: 1px solid var(--color3) inset, 2px solid var(--color3); */
      border: 2px solid var(--color2);
      /* outline: inset 2px solid var(--color2) ; */
      /* padding: 2px; */
      /* box-shadow:0px 0px 0px 2px var(--color3) ; */
      box-shadow: 0px 0px 10px 10px var(--color3), 0px 0px 10px 5px var(--color1) inset, 0px 0px 2px 2px var(--color1)  ;
      transition: all 0.5s ease;
      /* animation: pulse 2s ease infinite; */
      /* outline: 5px solid var(--color2) inset; */
    }
    .button:active {
      background: var(--color2);
    }
    @keyframes pulse {
        0% {
            transform: scale(1);
            box-shadow: 1px 0 10px 5px var(--color2), 0px 0px 5px 2px var(--color2);
        }
        12.5% {
            transform: scale(1);
            box-shadow: 0.5px 0.5px 10px 5px var(--color2), 0px 0px 5px 2px var(--color2);
        }
        25% {
            transform: scale(1);
            box-shadow: 0 1px 10px 5px var(--color2), 0px 0px 5px 2px var(--color2);
        }
        37.5% {
            transform: scale(1);
            box-shadow: -0.5px 0.5px 10px 5px var(--color2), 0px 0px 5px 2px var(--color2);
        }
        50% {
            transform: scale(1);
            box-shadow: -1px 0 10px 5px var(--color2), 0px 0px 5px 2px var(--color2);
        }
        62.5% {
            transform: scale(1);
            box-shadow: -0.5px -0.5px 10px 5px var(--color2), 0px 0px 5px 2px var(--color2);
        }

        75% {
            transform: scale(1);
            box-shadow: 0 -1px 10px 5px var(--color2), 0px 0px 5px 2px var(--color2);
        }
        88.5% {
            transform: scale(1);
            box-shadow: 0.5px -0.5px 10px 5px var(--color2), 0px 0px 5px 2px var(--color2);
        }
        100% {
            transform: scale(1);
            box-shadow: 1px 0px 10px 5px var(--color2), 0px 0px 5px 2px var(--color2);
        }
    }
</style>
