import { createClient } from "@supabase/supabase-js";

// Fallback prevents "supabaseUrl is required" crash during static prerendering.
// All actual Supabase calls happen inside useEffect (browser only).
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Feedback {
  id: string;
  text: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
}

// Per-device vote tracking (anonymous)
export type LocalVotes = Record<string, "up" | "down">;

export const VOTES_STORAGE_KEY = "wattwise-votes";

export function getLocalVotes(): LocalVotes {
  try {
    const raw = localStorage.getItem(VOTES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalVotes) : {};
  } catch {
    return {};
  }
}

export function setLocalVotes(votes: LocalVotes): void {
  try {
    localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
  } catch {
    // ignore
  }
}
