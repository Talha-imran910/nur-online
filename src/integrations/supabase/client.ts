import { createClient } from "@supabase/supabase-js";

// Public publishable key — safe to commit. Real security is enforced by RLS in Supabase.
const SUPABASE_URL = "https://yvrtcxeuqygvffhnvyf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_5WTpYvpIlhOKKIleykRSvA_ey1w1ddC";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
  },
});

/** Returns true if the currently logged-in user has the 'teacher' role. */
export async function isCurrentUserTeacher(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "teacher")
    .maybeSingle();
  return !!data;
}
