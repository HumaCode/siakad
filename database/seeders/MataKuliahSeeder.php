<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MataKuliah;
use App\Models\Prodi;
use App\Models\Dosen;
use Illuminate\Support\Collection;

class MataKuliahSeeder extends Seeder
{
    public function run(): void
    {
        $prodiTI  = Prodi::where('kode', 'IF')->first();
        $prodiSI  = Prodi::where('kode', 'SI')->first();
        $prodiMAT = Prodi::where('kode', 'MAT')->first();
        $prodiMAN = Prodi::where('kode', 'MAN')->first();

        // Ambil semua dosen per prodi (sudah di-seed di UsersAndCivitasSeeder)
        $dosenTI  = Dosen::where('prodi_id', $prodiTI?->id)->get();
        $dosenSI  = Dosen::where('prodi_id', $prodiSI?->id)->get();
        $dosenMAT = Dosen::where('prodi_id', $prodiMAT?->id)->get();
        $dosenMAN = Dosen::where('prodi_id', $prodiMAN?->id)->get();

        /**
         * Pilih dosen ke-i secara bergilir (round-robin) dari koleksi.
         */
        $pick = fn (Collection $col, int $i): ?string => $col->isNotEmpty()
            ? $col->values()->get($i % $col->count())?->id
            : null;

        // ── Teknik Informatika (8 MK) ──────────────────────────────
        $coursesTI = [
            ['kode' => 'TI501', 'nama' => 'Algoritma & Pemrograman',      'sks' => 3, 'sem' => 5, 'jenis' => 'Wajib',   'prasyarat' => 'TI302', 'status' => 'Aktif',    'deskripsi' => 'Mata kuliah dasar algoritma dan pemrograman menggunakan bahasa pemrograman tingkat tinggi.'],
            ['kode' => 'TI502', 'nama' => 'Basis Data Lanjut',            'sks' => 3, 'sem' => 5, 'jenis' => 'Wajib',   'prasyarat' => 'TI301', 'status' => 'Aktif',    'deskripsi' => 'Pembahasan mendalam tentang perancangan basis data relasional dan non-relasional.'],
            ['kode' => 'TI503', 'nama' => 'Rekayasa Perangkat Lunak',     'sks' => 3, 'sem' => 5, 'jenis' => 'Wajib',   'prasyarat' => '-',     'status' => 'Aktif',    'deskripsi' => 'Pengenalan siklus hidup pengembangan perangkat lunak (SDLC).'],
            ['kode' => 'TI504', 'nama' => 'Jaringan Komputer',            'sks' => 2, 'sem' => 5, 'jenis' => 'Wajib',   'prasyarat' => '-',     'status' => 'Aktif',    'deskripsi' => 'Konsep dasar jaringan komputer, protokol, dan arsitektur OSI.'],
            ['kode' => 'TI505', 'nama' => 'Metode Penelitian',            'sks' => 2, 'sem' => 5, 'jenis' => 'Wajib',   'prasyarat' => '-',     'status' => 'Aktif',    'deskripsi' => 'Metodologi penelitian ilmiah bidang teknologi informasi.'],
            ['kode' => 'TI506', 'nama' => 'Keamanan Siber',               'sks' => 3, 'sem' => 5, 'jenis' => 'Pilihan', 'prasyarat' => 'TI504', 'status' => 'Aktif',    'deskripsi' => 'Konsep dasar keamanan informasi dan sistem komputer.'],
            ['kode' => 'TI507', 'nama' => 'Machine Learning',             'sks' => 3, 'sem' => 7, 'jenis' => 'Pilihan', 'prasyarat' => 'TI601', 'status' => 'Nonaktif', 'deskripsi' => 'Pembelajaran mesin menggunakan Python dan framework modern.'],
            ['kode' => 'TI508', 'nama' => 'Pengembangan Aplikasi Mobile', 'sks' => 3, 'sem' => 6, 'jenis' => 'Pilihan', 'prasyarat' => 'TI501', 'status' => 'Aktif',    'deskripsi' => 'Pembuatan aplikasi mobile cross-platform menggunakan Flutter / React Native.'],
        ];

        // ── Sistem Informasi (4 MK) ────────────────────────────────
        $coursesSI = [
            ['kode' => 'SI401', 'nama' => 'Analisis & Desain Sistem',     'sks' => 3, 'sem' => 4, 'jenis' => 'Wajib',   'prasyarat' => '-',     'status' => 'Aktif', 'deskripsi' => 'Metodologi analisis dan desain sistem informasi bisnis.'],
            ['kode' => 'SI402', 'nama' => 'Manajemen Proyek SI',          'sks' => 2, 'sem' => 4, 'jenis' => 'Wajib',   'prasyarat' => 'SI301', 'status' => 'Aktif', 'deskripsi' => 'Manajemen proyek pengembangan sistem informasi menggunakan metodologi modern.'],
            ['kode' => 'SI403', 'nama' => 'Sistem Pendukung Keputusan',   'sks' => 3, 'sem' => 5, 'jenis' => 'Wajib',   'prasyarat' => '-',     'status' => 'Aktif', 'deskripsi' => 'Konsep dan implementasi sistem pendukung keputusan berbasis data.'],
            ['kode' => 'SI404', 'nama' => 'E-Business',                   'sks' => 2, 'sem' => 5, 'jenis' => 'Pilihan', 'prasyarat' => '-',     'status' => 'Aktif', 'deskripsi' => 'Strategi dan implementasi bisnis berbasis teknologi informasi.'],
        ];

        // ── Matematika (4 MK) ──────────────────────────────────────
        $coursesMAT = [
            ['kode' => 'MAT301', 'nama' => 'Kalkulus Lanjut',             'sks' => 3, 'sem' => 3, 'jenis' => 'Wajib',   'prasyarat' => 'MAT201', 'status' => 'Aktif', 'deskripsi' => 'Kalkulus multivariat, integral ganda, dan persamaan diferensial.'],
            ['kode' => 'MAT302', 'nama' => 'Aljabar Linear',              'sks' => 3, 'sem' => 3, 'jenis' => 'Wajib',   'prasyarat' => '-',      'status' => 'Aktif', 'deskripsi' => 'Vektor, matriks, transformasi linear, dan nilai eigen.'],
            ['kode' => 'MAT401', 'nama' => 'Statistika Terapan',          'sks' => 3, 'sem' => 4, 'jenis' => 'Wajib',   'prasyarat' => '-',      'status' => 'Aktif', 'deskripsi' => 'Penerapan statistika pada analisis data dan riset ilmiah.'],
            ['kode' => 'MAT402', 'nama' => 'Pemodelan Matematika',        'sks' => 3, 'sem' => 4, 'jenis' => 'Pilihan', 'prasyarat' => 'MAT301', 'status' => 'Aktif', 'deskripsi' => 'Pemodelan masalah nyata menggunakan persamaan diferensial dan optimasi.'],
        ];

        // ── Manajemen (4 MK) ───────────────────────────────────────
        $coursesMAN = [
            ['kode' => 'MB301', 'nama' => 'Manajemen Strategis',          'sks' => 3, 'sem' => 3, 'jenis' => 'Wajib',   'prasyarat' => '-', 'status' => 'Aktif', 'deskripsi' => 'Konsep manajemen strategis dan pengambilan keputusan bisnis tingkat tinggi.'],
            ['kode' => 'MB302', 'nama' => 'Kewirausahaan Digital',        'sks' => 2, 'sem' => 3, 'jenis' => 'Pilihan', 'prasyarat' => '-', 'status' => 'Aktif', 'deskripsi' => 'Pengenalan startup dan kewirausahaan berbasis teknologi digital.'],
            ['kode' => 'MB401', 'nama' => 'Pemasaran Digital',            'sks' => 3, 'sem' => 4, 'jenis' => 'Wajib',   'prasyarat' => '-', 'status' => 'Aktif', 'deskripsi' => 'Strategi pemasaran berbasis media digital dan analitik konsumen.'],
            ['kode' => 'MB402', 'nama' => 'Manajemen Keuangan',           'sks' => 3, 'sem' => 4, 'jenis' => 'Wajib',   'prasyarat' => '-', 'status' => 'Aktif', 'deskripsi' => 'Pengelolaan keuangan perusahaan, investasi, dan analisis laporan keuangan.'],
        ];

        // ── Seed semua prodi dengan round-robin dosen ──────────────
        $allGroups = [
            ['prodi_id' => $prodiTI?->id,  'dosens' => $dosenTI,  'courses' => $coursesTI],
            ['prodi_id' => $prodiSI?->id,  'dosens' => $dosenSI,  'courses' => $coursesSI],
            ['prodi_id' => $prodiMAT?->id, 'dosens' => $dosenMAT, 'courses' => $coursesMAT],
            ['prodi_id' => $prodiMAN?->id, 'dosens' => $dosenMAN, 'courses' => $coursesMAN],
        ];

        foreach ($allGroups as $group) {
            if (!$group['prodi_id'] || $group['dosens']->isEmpty()) {
                continue;
            }

            foreach ($group['courses'] as $i => $c) {
                $dosenId = $pick($group['dosens'], $i);
                if (!$dosenId) continue;

                $totalSks         = (int) $c['sks'];
                $c['sks_praktik'] = $totalSks % 2 === 0 ? 0 : 1;
                $c['sks_teori']   = $totalSks - $c['sks_praktik'];
                $c['prodi_id']    = $group['prodi_id'];
                $c['dosen_id']    = $dosenId;

                MataKuliah::create($c);
            }
        }
    }
}
