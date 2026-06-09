<?php

namespace Database\Seeders;

use App\Models\Fakultas;
use App\Models\Prodi;
use App\Models\Ruangan;
use App\Models\TahunAkademik;
use Illuminate\Database\Seeder;

class AcademicMasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Fakultas
        $fakultasTeknik = Fakultas::create([
            'kode' => 'FT',
            'nama' => 'Fakultas Teknik',
            'dekan' => 'Prof. Dr. Ir. H. Ahmad Fauzi, M.T.',
        ]);

        $fakultasMipa = Fakultas::create([
            'kode' => 'FMIPA',
            'nama' => 'Fakultas Matematika dan Ilmu Pengetahuan Alam',
            'dekan' => 'Dr. Dra. Rina Wijayanti, M.Si.',
        ]);

        $fakultasEkonomi = Fakultas::create([
            'kode' => 'FEB',
            'nama' => 'Fakultas Ekonomi dan Bisnis',
            'dekan' => 'Dr. H. Bambang Setiawan, S.E., M.M.',
        ]);

        // 2. Seed Prodi (Program Studi)
        // FT
        $prodiTI = Prodi::create([
            'fakultas_id' => $fakultasTeknik->id,
            'kode' => 'IF',
            'nama' => 'Teknik Informatika',
            'jenjang' => 'S1',
            'kaprodi' => 'Hendra Wijaya, S.T., M.T.',
            'status' => 'Aktif',
            'sks' => 148,
            'lama_studi' => 8,
            'akreditasi' => 'Unggul',
            'tahun' => 2026,
            'deskripsi' => 'Kurikulum berbasis KKNI Level 6, menekankan rekayasa perangkat lunak, kecerdasan buatan, dan keamanan siber.',
        ]);

        $prodiSI = Prodi::create([
            'fakultas_id' => $fakultasTeknik->id,
            'kode' => 'SI',
            'nama' => 'Sistem Informasi',
            'jenjang' => 'S1',
            'kaprodi' => 'Lutfi Hakim, S.Kom., M.T.I.',
            'status' => 'Aktif',
            'sks' => 144,
            'lama_studi' => 8,
            'akreditasi' => 'Unggul',
            'tahun' => 2026,
            'deskripsi' => 'Fokus pada perancangan dan pengelolaan sistem informasi bisnis, analitik data, dan transformasi digital.',
        ]);

        // FMIPA
        $prodiMat = Prodi::create([
            'fakultas_id' => $fakultasMipa->id,
            'kode' => 'MAT',
            'nama' => 'Matematika',
            'jenjang' => 'S1',
            'kaprodi' => 'Dr. Eko Prasetyo, M.Si.',
            'status' => 'Aktif',
            'sks' => 144,
            'lama_studi' => 8,
            'akreditasi' => 'A',
            'tahun' => 2026,
            'deskripsi' => 'Mata kuliah dasar matematika murni, aplikasi terapan komputer, sains data, serta optimisasi sistem.',
        ]);

        // FEB
        $prodiManaj = Prodi::create([
            'fakultas_id' => $fakultasEkonomi->id,
            'kode' => 'MAN',
            'nama' => 'Manajemen',
            'jenjang' => 'S1',
            'kaprodi' => 'Siti Aminah, S.E., M.B.A.',
            'status' => 'Aktif',
            'sks' => 144,
            'lama_studi' => 8,
            'akreditasi' => 'A',
            'tahun' => 2026,
            'deskripsi' => 'Mengembangkan kompetensi manajemen strategis, kewirausahaan, pemasaran, dan keuangan bisnis modern.',
        ]);

        // 3. Seed Tahun Akademik
        TahunAkademik::create([
            'tahun' => '2025/2026',
            'semester' => 'ganjil',
            'status' => true, // Aktif
        ]);

        TahunAkademik::create([
            'tahun' => '2025/2026',
            'semester' => 'genap',
            'status' => false,
        ]);

        // 4. Seed Ruangan
        Ruangan::create([
            'nama_gedung' => 'Gedung A (Dekanat)',
            'nama_ruangan' => 'Ruang Rapat Utama A101',
            'kapasitas' => 50,
        ]);

        Ruangan::create([
            'nama_gedung' => 'Gedung B (Lab Komputer)',
            'nama_ruangan' => 'Laboratorium Programming B201',
            'kapasitas' => 30,
        ]);

        Ruangan::create([
            'nama_gedung' => 'Gedung B (Lab Komputer)',
            'nama_ruangan' => 'Laboratorium Jaringan B202',
            'kapasitas' => 30,
        ]);

        Ruangan::create([
            'nama_gedung' => 'Gedung C (Kuliah Umum)',
            'nama_ruangan' => 'Ruang Kuliah C102',
            'kapasitas' => 40,
        ]);

        Ruangan::create([
            'nama_gedung' => 'Gedung C (Kuliah Umum)',
            'nama_ruangan' => 'Ruang Kuliah C103',
            'kapasitas' => 40,
        ]);
    }
}
