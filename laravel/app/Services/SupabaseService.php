<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

/**
 * Service Supabase (PostgREST) — disuntik Scaffdev Builder ke template Laravel.
 *
 * NOTED:
 * - File ini 100% milik modul "supabase" (lihat scaff.integration.json).
 * - Tidak ada SDK resmi PHP — best practice memakai REST langsung:
 *   {url}/rest/v1/{tabel} dengan header `apikey` + `Authorization: Bearer`.
 *   Ref: https://supabase.com/docs/guides/api
 * - Pakai ANON key (tunduk RLS). Service_role key JANGAN PERNAH dipakai
 *   di kode aplikasi — hanya untuk skrip admin/server-ke-server.
 */
class SupabaseService
{
    protected function client(): \Illuminate\Http\Client\PendingRequest
    {
        $url = config('services.supabase.url');
        $key = config('services.supabase.anon_key');
        abort_if(empty($url) || empty($key), 500, 'Isi NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY');

        return Http::baseUrl(rtrim($url, '/') . '/rest/v1')
            ->withHeaders(['apikey' => $key, 'Authorization' => "Bearer {$key}"])
            ->acceptJson()
            ->asJson();
    }

    /** Contoh: ambil semua baris tabel. Tambahkan query sesuai kebutuhanmu. */
    public function table(string $table, array $query = []): array
    {
        // NOTED: $table dari input user WAJIB divalidasi di controller
        // (whitelist) agar tidak jadi celah akses tabel sembarang.
        return $this->client()->get("/{$table}", $query)->throw()->json();
    }
}
