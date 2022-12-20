import type {PageServerLoad} from "./$types";

export const load: PageServerLoad = () => {

    const fetchTranslations = async () => {
        return []
    }

    return {
        translations: fetchTranslations(),
    }
}


