import type {PageLoad} from "./$types";
import {PUBLIC_API_URL} from "$env/static/public";

export const load: PageLoad = ({fetch}) => {
    const fetchTranslations = async () => {
        const data = await fetch(PUBLIC_API_URL + '/tl')
            .then(res => res.json())
            .then(data => data)
            .catch(() => []);
        console.log(data);
        return data;
    }

    return {
        translations: fetchTranslations(),
    }
}


