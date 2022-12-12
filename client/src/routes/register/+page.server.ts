import type { PageServerLoad } from './$types';
import { invalid, redirect, type Actions } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';
import { z } from 'zod';

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
			.min(6, { message: 'Password must be at least 6 character long' })
			.max(64, { message: 'Password to long' }),
		confirm_password: z
			.string({ required_error: 'Confirm password required' })
			.min(6, { message: 'Password must be at least 6 character long' })
			.max(64, { message: 'Password to long' }),
		terms: z.enum(['on'], { required_error: "Please accept to sell your soul!" })
	})
	.superRefine(({ confirm_password, password }, ctx) => {
		if (confirm_password !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords did not match'
			});
		}
	});


export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request, fetch, cookies }) => {
		const userInfo = await request.formData();
		const data = Object.fromEntries(userInfo);
		let userID = ""
		try {
			const result = registerSchema.parse(data);
		} catch (err: any) {
			console.log('-------------------Parse Form Error--------------------');
			console.log(err);
			return invalid(400, { invalid: true, register: true, message: err.issues[0].message });
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

			if (!response.ok) {
				return invalid(401, { invalid: true, register: true, message: res.message });
			}
			userID = res.id
			cookies.set('idToken', res.idToken, { maxAge: 900, path: '/', httpOnly: true });
			cookies.set('refreshToken', res.refreshToken, { maxAge: 60 * 60 * 24 * 365, path: '/', httpOnly: true });
		} catch (err) {
			console.log('-------------------SERVER ERROR--------------------');
			console.log(err);
			return invalid(400, { invalid: true });
		}
		throw redirect(302, '/user/' + userID);
	},
}
