import type { PageServerLoad } from './$types';
import { invalid, redirect, type Actions } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';
import { z } from 'zod';

const loginSchema = z.object({
	email: z.string().min(1, { message: 'Email cannot be empty' }).email(),
	password: z.string().min(1, { message: 'Password cannot be empty'}).max(64)
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
			const result = loginSchema.parse(data);
		} catch (err: any) {
			console.log('-------------------Parse Form Error--------------------');
			console.log(err);
			const error = err.issues[0];
			return invalid(400, { invalid: true, login: true, message: error.message || '' });
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

			console.log("Login:", "Sending request to", PUBLIC_API_URL + '/auth/login');
			const response = await fetch(PUBLIC_API_URL + '/auth/login', fetchOptions);
			const res = await response.json();

			if (!response.ok) {
				console.log(res);
				return invalid(res.code, { invalid: true, login: true, message: res.message });
			}

			userID = res.id
			cookies.set('idToken', res.idToken, { maxAge: 900, path: '/', httpOnly: true, secure: false });
			cookies.set('refreshToken', res.refreshToken, { maxAge: 60 * 60 * 24 * 365, path: '/', httpOnly: true, secure: false });
		} catch (err) {
			console.log('-------------------SERVER ERROR--------------------');
			console.log(err);
			return invalid(400, { invalid: true, login: true, message: "Something went wrong. We are Sorry" });
		}
		throw redirect(302, '/user/' +  userID );
	},
};