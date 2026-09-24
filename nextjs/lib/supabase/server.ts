/**
 * Supabase client untuk SERVER (Server Component, Server Action, Route Handler).
 * Disuntik Scaffdev Builder ke template Next.js.
 *
 * NOTED:
 * - WAJIB buat client baru per request (baca cookies dari request aktif).
 *   Jangan simpan di variabel global — session user bisa bocor antar request.
 * - Untuk proteksi halaman/data pakai getClaims() (verifikasi signature),
 *   BUKAN getSession() (hanya baca cookie tanpa verifikasi).
 *
 * Referensi resmi: https://supabase.com/docs/guides/auth/server-side/nextjs
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function env(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("MISSING_ENV: isi NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local");
  }
  return { url, key };
}

/**
 * Contoh pakai di Server Component:
 *   const supabase = await createClient();
 *   const { data: { claims } } = await supabase.auth.getClaims();
 *   if (!claims) redirect("/login");
 */
export async function createClient() {
  const { url, key } = env();
  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          // NOTED: Server Component tidak boleh menulis cookie — blok ini
          // hanya jalan di Server Action / Route Handler. Error diabaikan
          // karena proxy.ts yang menangani refresh session tiap request.
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Dipanggil dari Server Component — aman diabaikan.
        }
      },
    },
  });
}
