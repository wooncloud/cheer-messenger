import { supabase } from '$lib/supabase'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, locals: { getSession } }) => {
	const session = await getSession()
	if (!session) {
		throw error(401, 'Unauthorized')
	}

	// Get group information
	const { data: group, error: groupError } = await supabase
		.from('groups')
		.select(`
			*,
			owner:users!groups_owner_id_fkey(name, email)
		`)
		.eq('id', params.id)
		.single()

	if (groupError) {
		throw error(404, 'Group not found')
	}

	// Check if current user is a member
	const { data: membership } = await supabase
		.from('group_members')
		.select('role, is_active')
		.eq('group_id', params.id)
		.eq('user_id', session.user.id)
		.single()

	if (!membership || !membership.is_active) {
		throw error(403, 'You are not a member of this group')
	}

	return {
		group: {
			...group,
			user_role: membership.role
		}
	}
}