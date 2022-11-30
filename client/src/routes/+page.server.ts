import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import { z } from 'zod';

// Define Register User object, The form is checked agaisnt
const registerSchema = z
	.object({
		first_name: z
			.string({ required_error: 'First name required' })
			.min(2, { message: 'First Name is to short' })
			.max(64, { message: 'First Name is to long' })
			.trim(),
		last_name: z
			.string({ required_error: 'Last name required' })
			.min(2, { message: 'Last Name is to short' })
			.max(64, { message: 'Last Name is to long' })
			.trim(),
		email: z
			.string({ required_error: 'Email Required' })
			.min(1, { message: 'Email Required' })
			.max(64, { message: 'Email to long' })
			.email({ message: 'Must Be valid Email' }),
		password: z
			.string({ required_error: 'Password required' })
			.min(4, { message: 'Password must be atleast 4 character long' })
			.max(64, { message: 'Password to long' }),
		confirm_password: z
			.string({ required_error: 'Confirm password required' })
			.min(4, { message: 'Password must be atleast 4 character long' })
			.max(64, { message: 'Password to long' })
	})
	.superRefine(({ confirm_password, password }, ctx) => {
		if (confirm_password !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords did not match'
			});
		}
	});

const loginSchema = z.object({
	email: z.string().min(1).max(64).email(),
	password: z.string().min(4).max(64)
});

// This will laater link to our translations database

// const fetchTranslations = async () => {
//     const res = await fetch ("TRANSLATIONS URL HERE")
//     const data = await res.json()
//     return data.results
// }
const fillText: String =
	'This Text was loaded throught the server and will be replaced by api calls to our translation database when needed!';
const fillText2: String = 'This text was also loaded like that, but is diffrent';
const fillText3: String = 'Okay i get it now. get on with your work';

export const load: PageServerLoad = async ({ params }) => {
	return {
		fillerText: fillText,
		fillerText2: fillText2,
		fillerText3: fillText3,
		// translations: fetchTranslations()
		
	};
	
};

export const actions: Actions = {
	login: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		try {
			const result = loginSchema.parse(data);
			console.log('You clicked Login!  ');
		} catch (err) {
			console.log(err);
		}
	},
	register: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		try {
			const result = registerSchema.parse(data);
			console.log('It worked!  ');
			console.log(result);
		} catch (err) {
			console.log('You clicked Register! But it didnt work  ');
			console.log(err);
		}
	}
};
