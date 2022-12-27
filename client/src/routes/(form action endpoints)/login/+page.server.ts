import type { PageServerLoad } from './$types';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import bcrypt from "bcrypt";
import { z } from 'zod';

import db from '$lib/server/database/DatabaseGateway';
import Logger from "$lib/server/util/Logger";
import Jwt from "$lib/server/security/jwt";

const loginSchema = z.object({
	email: z.string().min(1, { message: 'Email cannot be empty' }).email(),
	password: z.string().min(1, { message: 'Password cannot be empty'}).max(64)
});

export const load: PageServerLoad = async () => {
	throw redirect(302, '/');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const userInfo = await request.formData();
		const data = Object.fromEntries(userInfo);

		try {
			loginSchema.parse(data);
		} catch (err: any) {
			console.log('-------------------Parse Form Error--------------------');
			console.log(err);
			const error = err.issues[0];
			return fail(400, { invalid: true, login: true, message: error.message || '' });
		}

		const email = userInfo.get('email');
		const password = userInfo.get('password');

		if (!email || !password || typeof email !== "string" || typeof password !== "string") {
			return fail(400, { invalid: true, message: "invalid credentials" });
		}

		const user = await db.userRepo.findUserByEmail(email);
		const isCorrectPassword = user && await bcrypt.compare(password, user.password_hash)

		// Email or password is incorrect
		if (!user || !isCorrectPassword) {
			Logger.log("Login:", "Email or password incorrect on login -", email);
			return fail(400, { invalid: true, message: "wrong credentials" });
		}

		// User is banned/disabled
		if (!user.enabled) {
			Logger.log("Login:", "User account disabled on login -", email);
			return fail(400, { disabled: true, message: "Account has been disabled" });
		}

		const idToken = await Jwt.signIdToken(user);
		const refreshToken = await Jwt.signNewRefreshTokenFamily(user.id);

		// User is banned/disabled
		if (!idToken || !refreshToken) {
			Logger.log("Login:", "Error signing jwt tokens");
			return fail(400, { error: true, message: "An unknown error has occurred" });
		}

		cookies.set('idToken', idToken, { maxAge: 900, path: '/', httpOnly: true, secure: false });
		cookies.set('refreshToken', refreshToken, { maxAge: 60 * 60 * 24 * 365, path: '/', httpOnly: true, secure: false });

		throw redirect(302, '/user/' +  user.id );
	},
};
