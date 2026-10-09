/**
 * Proxy Supabase — refresh token auth tiap request agar user tetap login.
 * Disuntik Scaffdev Builder ke root template Next.js.
 *
 * NOTED:
 * - Next.js 16 memakai `proxy.ts` (export default + `config.matcher`).
 *   Next.js ≤15 memakai `middleware.ts` (export function middleware) —
 *   isi kodenya SAMA, hanya nama file + nama fungsi yang beda.
 *   Bila template-mu Next ≤15: rename file ini jadi middleware.ts dan
 *   ganti `export default async function proxy` → `export async function middleware`.
 * - Matcher mengecualikan file statis agar proxy tidak jalan sia-sia.
 * - WAJIB kembalikan `supabaseResponse` (bawa cookie refresh). Membuat
 *   respons sendiri tanpa menyalin cookie = user logout misterius.
 *
 * Referensi resmi: https://supabase.com/docs/guides/auth/server-side/nextjs
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const { url, key } = env();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
        // NOTED (@supabase/ssr ≥0.10): headers auth (Cache-Control/Expires/Pragma)
        // WAJIB diterapkan ke respons agar CDN tidak meng-cache respons auth
        // dan bocor antar user.
        Object.entries(headers).forEach(([key, value]) =>
          supabaseResponse.headers.set(key, value)
        );
      },
    },
  });

  // NOTED: getClaims() memverifikasi signature token + me-refresh session
  // yang hampir kedaluwarsa. JANGAN diganti getSession() di server
  // (tidak verifikasi → cookie palsu bisa lolos).
  await supabase.auth.getClaims();

  return supabaseResponse;
}

export default async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
