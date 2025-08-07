import { SupabaseClient, Session } from '@supabase/supabase-js'
import type { Database } from '$lib/database.types'

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>
			getSession(): Promise<Session | null>
		}
		interface PageData {
			session: Session | null
		}
	}
}