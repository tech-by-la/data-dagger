import type { PageServerLoad } from './$types'
import { PUBLIC_API_URL } from '$env/static/public';
import { invalid, redirect, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  throw redirect(302, '/')
}

export const actions: Actions = {
    default: async ({fetch, cookies}) => {
		try {
			const fetchOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json'
				},
			};
			const response = await fetch(PUBLIC_API_URL + '/auth/logout', fetchOptions);
			cookies.delete('idToken')
			cookies.delete('refreshToken')
			console.log("You were logged out")
			return invalid(400, { invalid: true });
		} catch (err) {
			console.log('-------------------SERVER ERROR--------------------');
			console.log(err);
		}

	}
};
