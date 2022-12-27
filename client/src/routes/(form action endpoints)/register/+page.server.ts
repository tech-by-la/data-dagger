import type { PageServerLoad } from './$types';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { z } from 'zod';

import Logger from "$lib/server/util/Logger";
import db from '$lib/server/database/DatabaseGateway';
import Jwt from "$lib/server/security/jwt";

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
	throw redirect(302, '/');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const userInfo = await request.formData();
		const data = Object.fromEntries(userInfo);

		try {
			registerSchema.parse(data);
		} catch (err: any) {
			console.log('-------------------Parse Form Error--------------------');
			console.log(err);
			return fail(400, { invalid: true, register: true, message: err.issues[0].message });
		}

		const email = userInfo.get('email');
		const password = userInfo.get('password');
		const first_name = userInfo.get('first_name');
		const last_name = userInfo.get('last_name');

		if (
			!email || !password || !first_name || !last_name ||
			typeof email !== "string" || typeof password !== "string" ||
			typeof first_name !== "string" || typeof last_name !== "string"
		) {
			return fail(400, { invalid: true, message: "invalid credentials" });
		}

		// Email already in use
		if (await db.userRepo.findUserByEmail(email)) {
			Logger.log("Registration:", "Failed - Attempted to created account with email already in use");
			return fail(400, { conflict: true, message: "Email already in use" });
		}

		const user = await db.userRepo.createUser(email, password, first_name, last_name);

		// Error occurred when creating the user in the database
		if (!user) {
			Logger.error("Registration:", "Error - Failed to create user when querying database");
			return fail(400, { error: true, message: "An unknown error has occurred" });
		}

		Logger.log("Registration:", "Create new user with id", user.id);

		const idToken = await Jwt.signIdToken(user);
		const refreshToken = await Jwt.signNewRefreshTokenFamily(user.id);

		// User is banned/disabled
		if (!idToken || !refreshToken) {
			Logger.log("Registration:", "Error signing jwt tokens");
			return fail(400, { error: true, message: "An unknown error has occurred" });
		}

		cookies.set('idToken', idToken, { maxAge: 900, path: '/', httpOnly: true, secure: false });
		cookies.set('refreshToken', refreshToken, { maxAge: 60 * 60 * 24 * 365, path: '/', httpOnly: true, secure: false });

		throw redirect(302, '/user/' + user.id);
	},
}
