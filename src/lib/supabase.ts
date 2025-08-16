import { createBrowserClient, isBrowser } from "@supabase/ssr";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";
import type { Database } from "./database.types";

export const supabase = createBrowserClient<Database>(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
);

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Inserts<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type Updates<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
