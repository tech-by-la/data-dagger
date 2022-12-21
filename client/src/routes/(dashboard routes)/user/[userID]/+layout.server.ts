import type { LayoutServerLoad } from './$types';
import {error} from "@sveltejs/kit";
import {StatusCode, StatusMessage} from "$lib/server/util/enums";
import db from '$lib/server/database/DatabaseGateway';

export const load: LayoutServerLoad = async ({ locals, params}) => {
	if (locals.user.sub !== params.userID ) {
		throw error(StatusCode.UNAUTHORIZED, { message: StatusMessage.UNAUTHORIZED });
	}

	const fetchOrgs = async () => {
		const orgs = await db.orgRepo.findManyOrgsByUser_id(locals.user.sub);
		const projectCounts: {organization_id: string, count: number}[] = [];
		for (const org of orgs) {
			const count = await db.projectRepo.countbyOrg(org.id);
			projectCounts.push({organization_id: org.id, count});
		}
		return orgs.map(o => {
			return {...o, projectCount: projectCounts.find(p => p.organization_id === o.id)?.count}
		});
	}

	const fetchInvites = async () => {
		const invites = await db.inviteRepo.findInvitesByEmail(locals.user.email);
		const org_ids = invites.map(i => i.organization_id);
		const orgs = await db.orgRepo.findManyOrgsByIds(org_ids);
		return invites.map(i => {
			return {...i, organization_name: orgs.find(o => o.id === i.organization_id)?.name}
		});
	}

	return {
		userOrgs: fetchOrgs(),
		invites:  fetchInvites()
	}
};
