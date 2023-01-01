<script lang="ts">
	import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import Button from '$lib/Components/Button.svelte';
    import MdClose from 'svelte-icons/md/MdClose.svelte';
	import { slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import InputField from '$lib/Components/InputField.svelte';
    import { Checkbox } from "fluent-svelte";

    const { user, colors } = $page.data;
    let userEmail = user.email
</script>

<div class="form-wrapper" in:slide="{{delay: 250, duration: 250}}" out:slide="{{delay: 0, duration: 250}}">
    <Button btnClick= {() => goto(`/user/${user.sub}`)} btnTitle="" width = "50px" colorLight={colors.greenLight} colorMedium={colors.greenMedium} colorDark={colors.greenDark}> <div class="icon"><MdClose /></div></Button>
    <form class="form-form" method="POST" action="?/newOrg">
            <h1> Create New Organization</h1>
            <InputField name="name" type="text" placeholder="Organization Name" colorLight={colors.greenLight} colorMedium={colors.greenMediumTransparent} colorDark={'0'}></InputField>
            <InputField name="contact_email" type="text"  placeholder="Contact Email" colorLight={colors.greenLight} colorMedium={colors.greenMediumTransparent} colorDark={'0'}></InputField>
            <InputField name="contact_phone" type="text" placeholder="Contact Phone" colorLight={colors.greenLight} colorMedium={colors.greenMediumTransparent} colorDark={'0'}></InputField>
            <div class="checkbox-div">
                <input class="checkbox" type="checkbox" name="terms">
                <label for="terms"> I agree to terms and conditions</label>
            </div>

            <div class="inner-btn-div">
                <Button btnType ="reset" btnTitle="Reset" width="45%" colorLight={colors.greenLight} colorMedium={colors.greenMedium} colorDark={colors.greenDark}></Button>
                <Button btnType ="submit" btnTitle="Create" width="45%" colorLight={colors.greenLight} colorMedium={colors.greenMedium} colorDark={colors.greenDark}></Button>
        </div>

    </form>
</div>

<style>
    .form-wrapper, form {
        display: flex;
        flex-direction: column;
        /* border: 2px; */
        /* border-color: black; */
        justify-content: space-evenly;
    }
    .inner-btn-div {
        display: flex;
        flex-direction: row;
    }
    h1 {
        text-align: center;
        margin-top: 0;

    }
    .checkbox-div {
        display: flex;
        justify-content: center;
        margin: 5px;
        font-family: inherit;
    }
    .checkbox {
        display: grid;
        grid-template-columns: 2em auto;
        gap: 0.5em;
    }
    

</style>
