import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import db from '$lib/server/database/DatabaseGateway';
import {StatusMessage} from "$lib/server/util/enums";
import Logger from "$lib/server/util/Logger";

export const load: PageServerLoad = async ({parent}) => {
	await parent();
};

const createOrgSchema = z.object({
	name: z
			.string({ required_error: 'Name required' })
			.min(2, { message: 'Name is to short' })
			.max(64, { message: 'Name is to long' })
			.trim(),
	contact_phone: z
			.string({ required_error: 'Tlf nr. required' })
			.min(8, { message: 'Tlf nr. is to short' })
			.max(64, { message: 'Tlf nr. is to long' })
			.trim(),
	contact_email: z.string().min(1).max(64).email(),
	terms: z.enum(['on'])
});

export const actions: Actions = {
	newOrg: async ({ request, locals }) => {
		const orgInfo = await request.formData();
		const data = Object.fromEntries(orgInfo);
		try {
			const result = createOrgSchema.parse(data);
		} catch (err) {
			// console.log('-------------------Parse Form Error--------------------');
			// console.log(err);
			return fail(400, { invalid: true });
		}

		const name = orgInfo.get('name');
		const contact_email = orgInfo.get('contact_email');
		const contact_phone = orgInfo.get('contact_phone');

		if (
			!name 		   || typeof name !== "string" ||
			!contact_email || typeof contact_email !== "string" ||
			!contact_phone || typeof contact_phone !== "string"
		) {
			return fail(400, { message: StatusMessage.BAD_REQUEST });
		}

		const org = await db.orgRepo.createOrg(locals.user.sub, name, contact_email, contact_phone);

		if (!org) {
			Logger.error("An error occurred creating new organization with name, email, phone", name, contact_email, contact_phone);
			return fail(500, { message: StatusMessage.INTERNAL_SERVER_ERROR });
		}

		Logger.success('User', locals.user.first_name, locals.user.last_name, 'with email', locals.user.email, 'successfully created a new organization with name', name);
		throw redirect(302, '/org/' + org.id);
	},

};
