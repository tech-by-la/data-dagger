import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import { z } from 'zod';

const authServerURL = 'http://185.163.127.199/api/auth/';

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
			.max(64, { message: 'Password to long' }),
		terms: z.enum(['on'])
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
const fillText: string =
	'This Text was loaded throught the server and will be replaced by api calls to our translation database when needed!';
const fillText2: string = 'This text was also loaded like that, but is diffrent';
const fillText3: string = 'Okay i get it now. get on with your work';


export const load: PageServerLoad = async ({ params }) => {
	return {
		fillerText: fillText,
		fillerText2: fillText2,
		fillerText3: fillText3,
		
		// translations: fetchTranslations()
	};
};

export const actions: Actions = {
	login: async ({ request, fetch, cookies }) => {
		const userInfo = await request.formData()
		const data = Object.fromEntries(userInfo)
		try {
			const result = loginSchema.parse(data);
		} catch (err) {
			console.log('-------------------ERROR--------------------');
			console.log(err);
		}
		try {
			var loginData = JSON.stringify({
				email: data.email,
				password: data.password
			});

			const fetchOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json'
				},
				body: loginData
			};

			const response = await fetch(authServerURL + 'login', fetchOptions);
			const res = response.json();

			if(response.status == 200){console.log("Logged In as " + data.email);};

			// const tokenData = {idToken: }
			// cookies.set('idToken', res, {maxAge: 900})

		} catch (err) {
			console.log('-------------------ERROR--------------------');
			console.log(err);
		}
	},
	register: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		try {
			const result = registerSchema.parse(data);
			
		} catch (err) {
			console.log('You clicked Register! But it didnt work  ');
			console.log(err);
			
		}
	}
};
