

import type { PageServerLoad } from "./$types"
import type { Actions } from "@sveltejs/kit"

// This will laater link to our translations database
const fillText: String = "This Text was loaded throught the server and will be replaced by api calls to our translation database when needed!"
const fillText2: String = "This text was also loaded like that, but is diffrent"
const fillText3: String = "Okay i get it now. get on with your work"


export const load: PageServerLoad = async ({ params }) => {
    return {
        fillerText: fillText,
        fillerText2: fillText2,
        fillerText3: fillText3
    }
}

export const actions: Actions = {
    login: async ({ request }) => {
        const data = await request.formData()
        console.log("You clicked Login!  ")
        console.log(data)
        
    },
    register: async ({ request }) => {
        const data = await request.formData()
        console.log("You clicked Register!  ")
        console.log(data)
        
    }
}