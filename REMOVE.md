# Cara mencopot Supabase

> Dibutuhkan bila kamu ganti database/auth lain (mis. via Scaffdev Builder).
> Estimasi: ±10 menit. Ikuti berurutan — jangan loncat.

## 0. Aturan emas (baca dulu!)

- Hapus **HANYA** file di bagian 1. File lain **JANGAN PERNAH** dihapus.
- Kalau ragu satu file, BERHENTI dan tanya pembuat template.

---

## A. Template Next.js

### A.1. Hapus file (aman — tidak dipakai kode lain)

- `lib/supabase/client.ts` — client browser.
- `lib/supabase/server.ts` — client server.
- `proxy.ts` — refresh session tiap request. NOTED: hapus file ini HANYA bila
  tidak ada kode lain yang bergantung session Supabase. Bila template juga
  memakai proxy untuk hal lain, hapus HANYA bagian `updateSession` Supabase.

```bash
rm lib/supabase/client.ts lib/supabase/server.ts proxy.ts
```

### A.2. Hapus env (dari `.env.local`)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Hapus barisnya, jangan dikosongkan saja.

### A.3. Bersihkan dependency

```bash
npm uninstall @supabase/supabase-js @supabase/ssr
```

### A.4. Verifikasi (wajib lolos semua)

```bash
npm run build
```

```bash
grep -ri "supabase" app lib components proxy.ts middleware.ts 2>/dev/null
```

- Build harus sukses.
- Grep harus menghasilkan **0 baris**. Bila masih ada sisa (mis. query
  `.from(` di halaman), ganti dulu sumber datanya, lalu build ulang.

### A.5. Yang JANGAN dihapus

- Halaman/komponen umum (ganti sumber datanya dulu, baru hapus file modul).
- `package.json`, `.env.local` (cukup hapus baris env-nya), layout, config.

---

## B. Template Laravel

Modul ini v1.0.0 mendukung Next.js saja. File `laravel/` berstatus STAGED
(belum disuntik CLI) sehingga tidak ada yang perlu dicopot.
Berlaku mulai v1.1.0 — panduan section B akan ditambahkan saat itu.
