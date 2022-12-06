import type { PageServerLoad } from './$types';
import { invalid, redirect, type Actions } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';
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
const fillText =
	'This Text was loaded throught the server and will be replaced by api calls to our translation database when needed!';
const fillText2 = 'This text was also loaded like that, but is diffrent';
const fillText3 = 'Okay i get it now. get on with your work';

export const load: PageServerLoad = async ({ params }) => {
	return {
		fillerText: fillText,
		fillerText2: fillText2,
		fillerText3: fillText3
		// translations: fetchTranslations()
	};
};

export const actions: Actions = {
	login: async ({ request, fetch, cookies }) => {
		const userInfo = await request.formData();
		const data = Object.fromEntries(userInfo);
		let userID = ""
		try {
			const result = loginSchema.parse(data);
		} catch (err) {
			console.log('-------------------Parse Form Error--------------------');
			console.log(err);
			return invalid(400, { invalid: true });
		}
		try {
			const loginData = JSON.stringify({
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

			const response = await fetch(PUBLIC_API_URL + '/auth/login', fetchOptions);
			const res = await response.json();
			userID=res.id
			
			cookies.set('idToken', res.idToken, { maxAge: 900, path: '/', httpOnly: true });
			cookies.set('refreshToken', res.refreshToken, { maxAge: 60 * 60 * 24 * 365, path: '/', httpOnly: true });
		} catch (err) {
			console.log('-------------------SERVER ERROR--------------------');
			console.log(err);
			return invalid(400, { invalid: true });
		}
		throw redirect(302, '/user/' +  userID );
	},
	register: async ({ request, fetch, cookies }) => {
		const userInfo = await request.formData();
		const data = Object.fromEntries(userInfo);
		try {
			const result = registerSchema.parse(data);
		} catch (err) {
			console.log('-------------------Parse Form Error--------------------');
			console.log(err);
			return invalid(400, { invalid: true });
		}
		try {
			const loginData = JSON.stringify({
				first_name: data.first_name,
				last_name: data.last_name,
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

			const response = await fetch(PUBLIC_API_URL + '/auth/register', fetchOptions);
			const res = await response.json();
			cookies.set('idToken', res.idToken, { maxAge: 900, path: '/', httpOnly: true });
			cookies.set('refreshToken', res.refreshToken, { maxAge: 60 * 60 * 24 * 365, path: '/', httpOnly: true });
		} catch (err) {
			console.log('-------------------SERVER ERROR--------------------');
			console.log(err);
			return invalid(400, { invalid: true });
		}
		throw redirect(302, '/user/1');
	},
	logout: async ({fetch, cookies}) => {
		try {
			const fetchOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json'
				},
			};
			const response = await fetch(PUBLIC_API_URL + '/auth/logout', fetchOptions);
			console.log(response.status)
			cookies.delete('idToken')
			console.log("You were logged out")
			return invalid(400, { invalid: true });
		} catch (err) {
			console.log('-------------------SERVER ERROR--------------------');
			console.log(err);
		}
		cookies.delete('idToken')
		console.log("You were logged out")

	}
};
