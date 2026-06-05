<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Konfigurasi\Menu;
use App\Traits\HasMenuPermission;

class MenuSeeder extends Seeder
{
    use HasMenuPermission;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Category: MAIN MENU
        $categoryMain = 'MAIN MENU';

        // 1. Akademik (Parent)
        $akademik = Menu::updateOrCreate(
            ['url' => 'akademik'],
            [
                'name' => 'Akademik',
                'category' => $categoryMain,
                'icon' => 'academic-cap',
                'active' => true,
                'orders' => 10,
                'main_menu_id' => null,
            ]
        );
        $this->attachMenupermission($akademik, ['menu', 'read'], ['super_admin', 'admin', 'akademik', 'dosen', 'mahasiswa']);

        // 1.1 Kurikulum (Submenu)
        $kurikulum = Menu::updateOrCreate(
            ['url' => 'akademik/kurikulum'],
            [
                'name' => 'Kurikulum',
                'category' => $categoryMain,
                'icon' => null,
                'active' => true,
                'orders' => 11,
                'main_menu_id' => $akademik->id,
            ]
        );
        $this->attachMenupermission($kurikulum, null, ['super_admin', 'admin', 'akademik']);
        $this->attachMenupermission($kurikulum, ['menu', 'read'], ['dosen', 'mahasiswa']);

        // 1.2 Mata Kuliah (Submenu)
        $matakuliah = Menu::updateOrCreate(
            ['url' => 'akademik/mata-kuliah'],
            [
                'name' => 'Mata Kuliah',
                'category' => $categoryMain,
                'icon' => null,
                'active' => true,
                'orders' => 12,
                'main_menu_id' => $akademik->id,
            ]
        );
        $this->attachMenupermission($matakuliah, null, ['super_admin', 'admin', 'akademik']);
        $this->attachMenupermission($matakuliah, ['menu', 'read'], ['dosen', 'mahasiswa']);

        // 1.3 Jadwal Kuliah (Submenu)
        $jadwal = Menu::updateOrCreate(
            ['url' => 'akademik/jadwal-kuliah'],
            [
                'name' => 'Jadwal Kuliah',
                'category' => $categoryMain,
                'icon' => null,
                'active' => true,
                'orders' => 13,
                'main_menu_id' => $akademik->id,
            ]
        );
        $this->attachMenupermission($jadwal, null, ['super_admin', 'admin', 'akademik']);
        $this->attachMenupermission($jadwal, ['menu', 'read'], ['dosen', 'mahasiswa']);

        // 2. Mahasiswa
        $mahasiswa = Menu::updateOrCreate(
            ['url' => 'mahasiswa'],
            [
                'name' => 'Mahasiswa',
                'category' => $categoryMain,
                'icon' => 'user-group',
                'active' => true,
                'orders' => 20,
                'main_menu_id' => null,
            ]
        );
        $this->attachMenupermission($mahasiswa, null, ['super_admin', 'admin', 'akademik']);
        $this->attachMenupermission($mahasiswa, ['menu', 'read'], ['dosen']);

        // 3. Dosen
        $dosen = Menu::updateOrCreate(
            ['url' => 'dosen'],
            [
                'name' => 'Dosen',
                'category' => $categoryMain,
                'icon' => 'briefcase',
                'active' => true,
                'orders' => 30,
                'main_menu_id' => null,
            ]
        );
        $this->attachMenupermission($dosen, null, ['super_admin', 'admin', 'akademik']);

        // 4. KRS & KHS (Parent)
        $krsKhs = Menu::updateOrCreate(
            ['url' => 'krs-khs'],
            [
                'name' => 'KRS & KHS',
                'category' => $categoryMain,
                'icon' => 'document-text',
                'active' => true,
                'orders' => 40,
                'main_menu_id' => null,
            ]
        );
        $this->attachMenupermission($krsKhs, ['menu', 'read'], ['super_admin', 'admin', 'akademik', 'dosen', 'mahasiswa']);

        // 4.1 Pengajuan KRS (Submenu)
        $pengajuanKrs = Menu::updateOrCreate(
            ['url' => 'krs-khs/pengajuan-krs'],
            [
                'name' => 'Pengajuan KRS',
                'category' => $categoryMain,
                'icon' => null,
                'active' => true,
                'orders' => 41,
                'main_menu_id' => $krsKhs->id,
            ]
        );
        $this->attachMenupermission($pengajuanKrs, null, ['super_admin', 'admin', 'akademik']);
        $this->attachMenupermission($pengajuanKrs, ['menu', 'create', 'read', 'update', 'delete'], ['mahasiswa']);
        $this->attachMenupermission($pengajuanKrs, ['menu', 'read', 'update'], ['dosen']); // Untuk persetujuan KRS

        // 4.2 Input Nilai (Submenu)
        $inputNilai = Menu::updateOrCreate(
            ['url' => 'krs-khs/input-nilai'],
            [
                'name' => 'Input Nilai',
                'category' => $categoryMain,
                'icon' => null,
                'active' => true,
                'orders' => 42,
                'main_menu_id' => $krsKhs->id,
            ]
        );
        $this->attachMenupermission($inputNilai, null, ['super_admin', 'admin', 'akademik']);
        $this->attachMenupermission($inputNilai, ['menu', 'read', 'create', 'update'], ['dosen']);

        // 4.3 Transkrip (Submenu)
        $transkrip = Menu::updateOrCreate(
            ['url' => 'krs-khs/transkrip'],
            [
                'name' => 'Transkrip',
                'category' => $categoryMain,
                'icon' => null,
                'active' => true,
                'orders' => 43,
                'main_menu_id' => $krsKhs->id,
            ]
        );
        $this->attachMenupermission($transkrip, null, ['super_admin', 'admin', 'akademik']);
        $this->attachMenupermission($transkrip, ['menu', 'read'], ['mahasiswa', 'dosen']);

        // 5. Absensi
        $absensi = Menu::updateOrCreate(
            ['url' => 'absensi'],
            [
                'name' => 'Absensi',
                'category' => $categoryMain,
                'icon' => 'calendar',
                'active' => true,
                'orders' => 50,
                'main_menu_id' => null,
            ]
        );
        $this->attachMenupermission($absensi, null, ['super_admin', 'admin', 'akademik']);
        $this->attachMenupermission($absensi, ['menu', 'create', 'read', 'update'], ['dosen']);
        $this->attachMenupermission($absensi, ['menu', 'read'], ['mahasiswa']);


        // Category: KEUANGAN
        $categoryKeuangan = 'KEUANGAN';

        // 6. Tagihan SPP
        $tagihanSpp = Menu::updateOrCreate(
            ['url' => 'keuangan/tagihan-spp'],
            [
                'name' => 'Tagihan SPP',
                'category' => $categoryKeuangan,
                'icon' => 'credit-card',
                'active' => true,
                'orders' => 60,
                'main_menu_id' => null,
            ]
        );
        $this->attachMenupermission($tagihanSpp, null, ['super_admin', 'admin', 'keuangan']);
        $this->attachMenupermission($tagihanSpp, ['menu', 'read'], ['mahasiswa']);

        // 7. Riwayat Bayar
        $riwayatBayar = Menu::updateOrCreate(
            ['url' => 'keuangan/riwayat-bayar'],
            [
                'name' => 'Riwayat Bayar',
                'category' => $categoryKeuangan,
                'icon' => 'receipt-refund',
                'active' => true,
                'orders' => 70,
                'main_menu_id' => null,
            ]
        );
        $this->attachMenupermission($riwayatBayar, null, ['super_admin', 'admin', 'keuangan']);
        $this->attachMenupermission($riwayatBayar, ['menu', 'read'], ['mahasiswa']);


        // Category: SISTEM
        $categorySistem = 'SISTEM';

        // 8. Menu Manajemen
        $menuManajemen = Menu::updateOrCreate(
            ['url' => 'sistem/menu'],
            [
                'name' => 'Menu Manajemen',
                'category' => $categorySistem,
                'icon' => 'menu',
                'active' => true,
                'orders' => 80,
                'main_menu_id' => null,
            ]
        );
        $this->attachMenupermission($menuManajemen, null, ['super_admin']);

        // 9. Roles & Akses
        $rolesAkses = Menu::updateOrCreate(
            ['url' => 'sistem/roles'],
            [
                'name' => 'Roles & Akses',
                'category' => $categorySistem,
                'icon' => 'shield-check',
                'active' => true,
                'orders' => 90,
                'main_menu_id' => null,
            ]
        );
        $this->attachMenupermission($rolesAkses, null, ['super_admin']);

        // 10. Permission
        $permissionMenu = Menu::updateOrCreate(
            ['url' => 'sistem/permissions'],
            [
                'name' => 'Permission',
                'category' => $categorySistem,
                'icon' => 'key',
                'active' => true,
                'orders' => 100,
                'main_menu_id' => null,
            ]
        );
        $this->attachMenupermission($permissionMenu, null, ['super_admin']);

        // 11. Aktivity Log
        $activityLog = Menu::updateOrCreate(
            ['url' => 'sistem/activity-log'],
            [
                'name' => 'Aktivity Log',
                'category' => $categorySistem,
                'icon' => 'clipboard-list',
                'active' => true,
                'orders' => 110,
                'main_menu_id' => null,
            ]
        );
        $this->attachMenupermission($activityLog, null, ['super_admin']);

        // 12. Pengaturan
        $pengaturan = Menu::updateOrCreate(
            ['url' => 'sistem/pengaturan'],
            [
                'name' => 'Pengaturan',
                'category' => $categorySistem,
                'icon' => 'cog',
                'active' => true,
                'orders' => 120,
                'main_menu_id' => null,
            ]
        );
        $this->attachMenupermission($pengaturan, null, ['super_admin', 'admin']);
    }
}
