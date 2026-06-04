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
            'password' => Hash::make('password'),
        ]);
        $superAdmin->assignRole('super_admin');

        // 2. Create Admin
        $admin = User::create([
            'name' => 'Admin SIAKAD',
            'email' => 'admin@siakad.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('admin');

        // 3. Create Akademik Staff
        $akademik = User::create([
            'name' => 'Budi Setiawan (Staf Akademik)',
            'email' => 'akademik@siakad.com',
            'password' => Hash::make('password'),
        ]);
        $akademik->assignRole('akademik');

        // 4. Create Keuangan Staff
        $keuangan = User::create([
            'name' => 'Siti Rahma (Staf Keuangan)',
            'email' => 'keuangan@siakad.com',
            'password' => Hash::make('password'),
        ]);
        $keuangan->assignRole('keuangan');

        // Fetch prodis for relations
        $prodiTI = Prodi::where('kode', 'IF')->first();
        $prodiSI = Prodi::where('kode', 'SI')->first();

        // 5. Create Lecturers (Dosen)
        // Dosen 1 (TI)
        $userDosen1 = User::create([
            'name' => 'Hendra Wijaya, S.T., M.T.',
            'email' => 'hendra.dosen@siakad.com',
            'password' => Hash::make('password'),
        ]);
        $userDosen1->assignRole('dosen');
        
        $dosen1 = Dosen::create([
            'user_id' => $userDosen1->id,
            'nidn' => '0412038901',
            'nama' => 'Hendra Wijaya',
            'gelar_depan' => '',
            'gelar_belakang' => 'S.T., M.T.',
            'prodi_id' => $prodiTI->id,
            'status_dosen' => 'tetap',
        ]);

        // Dosen 2 (SI)
        $userDosen2 = User::create([
            'name' => 'Dr. Lutfi Hakim, S.Kom., M.T.I.',
            'email' => 'lutfi.dosen@siakad.com',
            'password' => Hash::make('password'),
        ]);
        $userDosen2->assignRole('dosen');

        $dosen2 = Dosen::create([
            'user_id' => $userDosen2->id,
            'nidn' => '0420078202',
            'nama' => 'Lutfi Hakim',
            'gelar_depan' => 'Dr.',
            'gelar_belakang' => 'S.Kom., M.T.I.',
            'prodi_id' => $prodiSI->id,
            'status_dosen' => 'tetap',
        ]);

        // 6. Create Students (Mahasiswa)
        // Mahasiswa 1 (TI - Bimbingan Dosen 1)
        $userMhs1 = User::create([
            'name' => 'Aditya Pratama',
            'email' => 'aditya.mhs@siakad.com',
            'password' => Hash::make('password'),
        ]);
        $userMhs1->assignRole('mahasiswa');

        Mahasiswa::create([
            'user_id' => $userMhs1->id,
            'nim' => '251011526101',
            'nama' => 'Aditya Pratama',
            'prodi_id' => $prodiTI->id,
            'angkatan' => 2025,
            'status_akademik' => 'aktif',
            'dosen_wali_id' => $dosen1->id,
        ]);

        // Mahasiswa 2 (SI - Bimbingan Dosen 2)
        $userMhs2 = User::create([
            'name' => 'Nabila Putri',
            'email' => 'nabila.mhs@siakad.com',
            'password' => Hash::make('password'),
        ]);
        $userMhs2->assignRole('mahasiswa');

        Mahasiswa::create([
            'user_id' => $userMhs2->id,
            'nim' => '251011526202',
            'nama' => 'Nabila Putri',
            'prodi_id' => $prodiSI->id,
            'angkatan' => 2025,
            'status_akademik' => 'aktif',
            'dosen_wali_id' => $dosen2->id,
        ]);
    }
}
