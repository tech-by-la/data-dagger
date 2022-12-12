import type { PageServerLoad } from './$types';


const fillText =
	'This Text was loaded throught the server and will be replaced by api calls to our translation database when needed!';
const fillText2 = 'This text was also loaded like that, but is diffrent';
const fillText3 = 'Okay i get it now. get on with your work';

export const load: PageServerLoad = async ({ }) => {
	return {
		fillerText: fillText,
		fillerText2: fillText2,
		fillerText3: fillText3
	};
};

