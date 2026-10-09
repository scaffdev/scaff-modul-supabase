/**
 * Supabase client untuk BROWSER (Client Component).
 * Disuntik Scaffdev Builder ke template Next.js.
 *
 * NOTED:
 * - File ini 100% milik modul "supabase". Jangan import dari kode inti template
 *   kecuali untuk fitur database/auth — saat copot modul, file ini dihapus CLI.
 * - createBrowserClient = singleton: aman dipanggil berkali-kali (1 instance).
 * - Anon key BOLEH di browser (dibatasi Row Level Security). Yang rahasia
 *   (service_role) TIDAK PERNAH dipakai di sini.
 *
 * Referensi resmi: https://supabase.com/docs/guides/auth/server-side/nextjs
 */
import { createBrowserClient } from "@supabase/ssr";

function env(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // NOTED: canonical = PUBLISHABLE_KEY (sb_publishable_...). ANON_KEY legacy
  // masih didukung sebagai fallback sampai akhir 2026 (lihat docs API keys).
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("MISSING_ENV: isi NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY di .env.local");
  }
  return { url, key };
}

/**
 * Dipakai di Client Component ("use client"), mis. realtime subscription
 * atau login form. Contoh:
 *   const supabase = createClient();
 *   const { data } = await supabase.from("todos").select();
 */
export function createClient() {
  const { url, key } = env();
  return createBrowserClient(url, key);
}
