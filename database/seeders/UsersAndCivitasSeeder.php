<?php

namespace Database\Seeders;

use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersAndCivitasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Super Admin
        $superAdmin = User::create([
            'name' => 'Super Administrator',
            'email' => 'superadmin@siakad.com',
            'username' => 'superadmin',
            'password' => Hash::make('password'),
        ]);
        $superAdmin->assignRole('super_admin');

        // Create Developer
        $developer = User::create([
            'name' => 'Developer SIAKAD',
            'email' => 'developer@siakad.com',
            'username' => 'dev',
            'password' => Hash::make('password'),
        ]);
        $developer->assignRole('dev');

        // 2. Create Admin
        $admin = User::create([
            'name' => 'Admin SIAKAD',
            'email' => 'admin@siakad.com',
            'username' => 'admin',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('admin');

        // 3. Create Akademik Staff
        $akademik = User::create([
            'name' => 'Budi Setiawan (Staf Akademik)',
            'email' => 'akademik@siakad.com',
            'username' => 'akademik',
            'password' => Hash::make('password'),
        ]);
        $akademik->assignRole('akademik');

        // 4. Create Keuangan Staff
        $keuangan = User::create([
            'name' => 'Siti Rahma (Staf Keuangan)',
            'email' => 'keuangan@siakad.com',
            'username' => 'keuangan',
            'password' => Hash::make('password'),
        ]);
        $keuangan->assignRole('keuangan');

        // Fetch prodis for relations
        $prodiTI  = Prodi::where('kode', 'IF')->first();
        $prodiSI  = Prodi::where('kode', 'SI')->first();
        $prodiMAT = Prodi::where('kode', 'MAT')->first();
        $prodiMAN = Prodi::where('kode', 'MAN')->first();

        // ─────────────────────────────────────────────
        // 5. Create Lecturers (Dosen) – 2 per prodi
        // ─────────────────────────────────────────────

        // ── Teknik Informatika ──
        $uD1 = User::create(['name' => 'Hendra Wijaya', 'email' => 'hendra.dosen@siakad.com', 'password' => Hash::make('password')]);
        $uD1->assignRole('dosen');
        $dosen1 = Dosen::create([
            'user_id' => $uD1->id, 'nidn' => '0412038901',
            'nama' => 'Hendra Wijaya', 'gelar_depan' => '', 'gelar_belakang' => 'S.T., M.T.',
            'prodi_id' => $prodiTI->id, 'status_dosen' => 'tetap', 'jabatan' => 'Lektor Kepala',
        ]);

        $uD2 = User::create(['name' => 'Rina Kartika', 'email' => 'rina.dosen@siakad.com', 'password' => Hash::make('password')]);
        $uD2->assignRole('dosen');
        $dosen2 = Dosen::create([
            'user_id' => $uD2->id, 'nidn' => '0518079401',
            'nama' => 'Rina Kartika', 'gelar_depan' => 'Dr.', 'gelar_belakang' => 'M.Kom.',
            'prodi_id' => $prodiTI->id, 'status_dosen' => 'tetap', 'jabatan' => 'Lektor',
        ]);

        // ── Sistem Informasi ──
        $uD3 = User::create(['name' => 'Lutfi Hakim', 'email' => 'lutfi.dosen@siakad.com', 'password' => Hash::make('password')]);
        $uD3->assignRole('dosen');
        $dosen3 = Dosen::create([
            'user_id' => $uD3->id, 'nidn' => '0420078202',
            'nama' => 'Lutfi Hakim', 'gelar_depan' => 'Dr.', 'gelar_belakang' => 'S.Kom., M.T.I.',
            'prodi_id' => $prodiSI->id, 'status_dosen' => 'tetap', 'jabatan' => 'Lektor Kepala',
        ]);

        $uD4 = User::create(['name' => 'Dewi Anggraeni', 'email' => 'dewi.dosen@siakad.com', 'password' => Hash::make('password')]);
        $uD4->assignRole('dosen');
        $dosen4 = Dosen::create([
            'user_id' => $uD4->id, 'nidn' => '0315088503',
            'nama' => 'Dewi Anggraeni', 'gelar_depan' => '', 'gelar_belakang' => 'S.Kom., M.M.',
            'prodi_id' => $prodiSI->id, 'status_dosen' => 'tetap', 'jabatan' => 'Asisten Ahli',
        ]);

        // ── Matematika ──
        $uD5 = User::create(['name' => 'Eko Prasetyo', 'email' => 'eko.dosen@siakad.com', 'password' => Hash::make('password')]);
        $uD5->assignRole('dosen');
        $dosen5 = Dosen::create([
            'user_id' => $uD5->id, 'nidn' => '0709076504',
            'nama' => 'Eko Prasetyo', 'gelar_depan' => 'Dr.', 'gelar_belakang' => 'M.Si.',
            'prodi_id' => $prodiMAT->id, 'status_dosen' => 'tetap', 'jabatan' => 'Guru Besar',
        ]);

        $uD6 = User::create(['name' => 'Sari Indah', 'email' => 'sari.dosen@siakad.com', 'password' => Hash::make('password')]);
        $uD6->assignRole('dosen');
        $dosen6 = Dosen::create([
            'user_id' => $uD6->id, 'nidn' => '0923079205',
            'nama' => 'Sari Indah', 'gelar_depan' => '', 'gelar_belakang' => 'S.Si., M.Si.',
            'prodi_id' => $prodiMAT->id, 'status_dosen' => 'tetap', 'jabatan' => 'Lektor',
        ]);

        // ── Manajemen ──
        $uD7 = User::create(['name' => 'Bambang Sudiro', 'email' => 'bambang.dosen@siakad.com', 'password' => Hash::make('password')]);
        $uD7->assignRole('dosen');
        $dosen7 = Dosen::create([
            'user_id' => $uD7->id, 'nidn' => '0614067806',
            'nama' => 'Bambang Sudiro', 'gelar_depan' => 'Dr.', 'gelar_belakang' => 'S.E., M.M.',
            'prodi_id' => $prodiMAN->id, 'status_dosen' => 'tetap', 'jabatan' => 'Lektor Kepala',
        ]);

        $uD8 = User::create(['name' => 'Siti Aminah', 'email' => 'siti.dosen@siakad.com', 'password' => Hash::make('password')]);
        $uD8->assignRole('dosen');
        $dosen8 = Dosen::create([
            'user_id' => $uD8->id, 'nidn' => '0827038907',
            'nama' => 'Siti Aminah', 'gelar_depan' => '', 'gelar_belakang' => 'S.E., M.B.A.',
            'prodi_id' => $prodiMAN->id, 'status_dosen' => 'tetap', 'jabatan' => 'Asisten Ahli',
        ]);

        // ─────────────────────────────────────────────
        // 6. Create Students (Mahasiswa)
        // ─────────────────────────────────────────────

        // Mahasiswa 1 (TI - Bimbingan Dosen 1)
        $userMhs1 = User::create([
            'name' => 'Aditya Pratama',
            'email' => 'aditya.mhs@siakad.com',
            'password' => Hash::make('password'),
        ]);
        $userMhs1->assignRole('mahasiswa');
        Mahasiswa::create([
            'user_id' => $userMhs1->id, 'nim' => '251011526101',
            'nama' => 'Aditya Pratama', 'prodi_id' => $prodiTI->id,
            'angkatan' => 2025, 'status_akademik' => 'aktif', 'dosen_wali_id' => $dosen1->id,
        ]);

        // Mahasiswa 2 (SI - Bimbingan Dosen 3)
        $userMhs2 = User::create([
            'name' => 'Nabila Putri',
            'email' => 'nabila.mhs@siakad.com',
            'password' => Hash::make('password'),
        ]);
        $userMhs2->assignRole('mahasiswa');
        Mahasiswa::create([
            'user_id' => $userMhs2->id, 'nim' => '251011526202',
            'nama' => 'Nabila Putri', 'prodi_id' => $prodiSI->id,
            'angkatan' => 2025, 'status_akademik' => 'aktif', 'dosen_wali_id' => $dosen3->id,
        ]);
    }
}
