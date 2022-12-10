import type {PageServerLoad} from "./$types";
import { PUBLIC_API_URL } from '$env/static/public';
import { redirect, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({fetch, cookies}) => {

	await fetch(PUBLIC_API_URL + '/auth/logout', { method: "POST" })
		.then(res => console.log('Logout response:', res.status, res.statusText))
		.catch(err => console.log('Logout error:', err));

	cookies.delete('idToken');
	cookies.delete('refreshToken');
	throw redirect(302, '/');

}
export const actions: Actions = {
    default: async ({fetch, cookies}) => {

		const fetchOptions = {
			method: 'POST',
		};

		await fetch(PUBLIC_API_URL + '/auth/logout', fetchOptions)
			.then(res => console.log('Logout response:', res.status, res.statusText))
			.catch(err => console.log('Logout error:', err));

		cookies.delete('idToken');
		cookies.delete('refreshToken');
		// console.log("You were logged out")
		throw redirect(302, '/');

		// } catch (err) {
		// 	console.log('-------------------SERVER ERROR--------------------');
		// 	console.log(err);
		// }

	}
};
