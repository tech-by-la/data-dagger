import { invalid, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import { z } from 'zod';


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

export const load: PageServerLoad = async () => {
	
	return {};
};

export const actions: Actions = {
	newOrg: async ({ request, fetch, locals }) => {
		const orgInfo = await request.formData();
		const data = Object.fromEntries(orgInfo);
		try {
			const result = createOrgSchema.parse(data);
		} catch (err) {
			console.log('-------------------Parse Form Error--------------------');
			console.log(err);
			return invalid(400, { invalid: true });
		}
		try {
			const loginData = JSON.stringify({
				name: data.name,
				contact_phone: data.contact_phone,
				contact_email: data.contact_email,
				
			});

			const fetchOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json'
				},
				body: loginData
			};

			const response = await fetch(PUBLIC_API_URL + '/auth/orgs', fetchOptions);
			console.log(response.status);

		} catch (err) {
			console.log('-------------------SERVER ERROR--------------------');
			console.log(err);
			return invalid(400, { invalid: true });
		}
		console.log("Org Created: " + data.name);
		
		throw redirect(302, '/user/' + locals.user.sub  );
	},
	
};