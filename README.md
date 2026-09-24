# scaff-modul-supabase

Modul **Supabase** (Postgres + Auth) pola SSR resmi untuk
[Scaffdev](https://scaffdev.vercel.app) Builder.
Disuntik via `scaff ... --with=supabase` (CLI 0.2.0+).

| Framework | Status | Isi |
|---|---|---|
| Next.js | ✅ v1.0.0 | Browser client + server client + proxy refresh session |
| Laravel | 🟡 STAGED (v1.1.0) | Service PostgREST sudah ditulis, belum disuntik CLI |

## Struktur

```
scaff-modul-supabase/
├── scaff.integration.json   ← manifest (satu-satunya yang dibaca CLI)
├── SETUP-FRAGMENT.md        ← digabung ke SETUP.md hasil racikan
├── REMOVE.md                ← panduan copot (skenario double database/auth)
├── nextjs/
│   ├── lib/supabase/{client.ts,server.ts}
│   └── proxy.ts             ← rename jadi middleware.ts bila Next ≤15
└── laravel/                 ← STAGED untuk v1.1.0
    └── app/Services/SupabaseService.php
```

## Env (harus terdaftar di admin Scaffdev → tabel `integrasi`)

| Key | Keterangan |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (atau publishable key project baru) |

## Validasi lokal (sebelum push)

```bash
scaffdev validate-module .
```

## Docs resmi yang dirujuk kode

- SSR + Clients + Proxy: https://supabase.com/docs/guides/auth/server-side/nextjs
- `getClaims` vs `getSession`: https://supabase.com/docs/guides/auth/server-side/nextjs#choosing-an-auth-method
