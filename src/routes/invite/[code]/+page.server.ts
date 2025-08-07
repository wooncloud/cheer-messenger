import { getGroupByInviteCode } from '$lib/utils/groups'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	try {
		const group = await getGroupByInviteCode(params.code)
		return {
			group
		}
	} catch (err) {
		throw error(404, 'Invalid invite code')
	}
}