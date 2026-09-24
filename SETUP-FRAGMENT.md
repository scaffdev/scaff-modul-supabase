## Setup Supabase (digabung otomatis ke SETUP.md)

> 3 langkah, ±5 menit. Tier gratis cukup untuk mulai.
> Docs resmi: https://supabase.com/docs/guides/auth/server-side/nextjs

### 1. Buat project

1. Daftar/login di https://supabase.com/dashboard → **New project**.
2. Buka **Settings → API** (atau dialog **Connect**), salin **Project URL**
   dan **anon key**.
   NOTED: project BARU memakai **publishable key** (`sb_publishable_...`)
   sebagai pengganti anon key — taruh di env yang sama di bawah, tetap jalan.

### 2. Isi env + install dependency

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

```bash
npm install @supabase/supabase-js @supabase/ssr
```

NOTED: CLI Builder meng-merge dependency ini otomatis saat `--install`.
Perintah di atas hanya bila kamu meracik manual.

### 3. Pakai di kode

**Client Component** (`"use client"` — mis. form login, realtime):

```ts
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
const { data } = await supabase.from("todos").select();
```

NOTED: `@/lib/...` di contoh ini = `lib/...` dari modul. Sesuaikan dengan
alias import di template-mu (relatif `../../lib/...` bila tanpa alias).

**Server Component / Server Action / Route Handler:**

```ts
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
// Proteksi: verifikasi, jangan percaya cookie mentah
const { data: { claims } } = await supabase.auth.getClaims();
if (!claims) redirect("/login");
```

**Proxy** (`proxy.ts` di root) sudah otomatis refresh session tiap request —
tidak perlu diubah. Bila template-mu Next.js ≤15, rename jadi `middleware.ts`
(lihat NOTED di dalam file).
