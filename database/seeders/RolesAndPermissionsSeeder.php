<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Create Permissions
        $permissions = [
            // User Management
            'manage-users',
            'manage-roles',

            // Master Data
            'manage-faculties',
            'manage-prodis',
            'manage-rooms',
            'manage-academic-years',

            // Civitas
            'manage-dosen',
            'manage-mahasiswa',

            // Academic Operations
            'manage-curriculums',
            'manage-subjects',
            'manage-schedules',
            'manage-krs',
            'approve-krs',
            'submit-krs',

            // Teaching Operations
            'view-teaching-schedule',
            'input-attendance',
            'input-grades',

            // Student Operations
            'view-grades',
            'view-schedule',
            'view-attendance',

            // Finance
            'manage-billing',
            'verify-payments',
            'view-billing',
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['name' => $permission, 'guard_name' => 'web'],
                ['is_active' => true]
            );
        }

        // Clear cache again to make sure all newly created permissions are in cache
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Create Roles and Assign Permissions

        // 1. Super Admin
        $superAdminRole = Role::updateOrCreate(
            ['name' => 'super_admin', 'guard_name' => 'web'],
            [
                'slug' => 'super-admin',
                'type_role' => 'internal',
                'color' => '#dc2626',
                'priority' => 1,
                'is_active' => true,
                'description' => 'Super Administrator dengan akses penuh ke seluruh modul sistem.'
            ]
        );

        // 2. Admin
        $adminRole = Role::updateOrCreate(
            ['name' => 'admin', 'guard_name' => 'web'],
            [
                'slug' => 'admin',
                'type_role' => 'internal',
                'color' => '#2563eb',
                'priority' => 2,
                'is_active' => true,
                'description' => 'Administrator Akademik dan Pengelola Civitas.'
            ]
        );
        $adminRole->givePermissionTo([
            'manage-users',
            'manage-faculties',
            'manage-prodis',
            'manage-rooms',
            'manage-academic-years',
            'manage-dosen',
            'manage-mahasiswa',
        ]);

        // 3. Akademik
        $akademikRole = Role::updateOrCreate(
            ['name' => 'akademik', 'guard_name' => 'web'],
            [
                'slug' => 'akademik',
                'type_role' => 'internal',
                'color' => '#0d9488',
                'priority' => 3,
                'is_active' => true,
                'description' => 'Staf Administrasi Akademik pengelola kurikulum, jadwal, dan KRS.'
            ]
        );
        $akademikRole->givePermissionTo([
            'manage-academic-years',
            'manage-curriculums',
            'manage-subjects',
            'manage-schedules',
            'manage-krs',
        ]);

        // 4. Dosen
        $dosenRole = Role::updateOrCreate(
            ['name' => 'dosen', 'guard_name' => 'web'],
            [
                'slug' => 'dosen',
                'type_role' => 'academic',
                'color' => '#f59e0b',
                'priority' => 4,
                'is_active' => true,
                'description' => 'Tenaga Pendidik / Dosen pengajar dan penilai akademik.'
            ]
        );
        $dosenRole->givePermissionTo([
            'view-teaching-schedule',
            'approve-krs',
            'input-attendance',
            'input-grades',
        ]);

        // 5. Mahasiswa
        $mahasiswaRole = Role::updateOrCreate(
            ['name' => 'mahasiswa', 'guard_name' => 'web'],
            [
                'slug' => 'mahasiswa',
                'type_role' => 'academic',
                'color' => '#6366f1',
                'priority' => 5,
                'is_active' => true,
                'description' => 'Mahasiswa aktif terdaftar.'
            ]
        );
        $mahasiswaRole->givePermissionTo([
            'submit-krs',
            'view-grades',
            'view-schedule',
            'view-attendance',
            'view-billing',
        ]);

        // 6. Keuangan
        $keuanganRole = Role::updateOrCreate(
            ['name' => 'keuangan', 'guard_name' => 'web'],
            [
                'slug' => 'keuangan',
                'type_role' => 'finance',
                'color' => '#059669',
                'priority' => 6,
                'is_active' => true,
                'description' => 'Staf Bagian Keuangan pengelola tagihan dan pembayaran.'
            ]
        );
        $keuanganRole->givePermissionTo([
            'manage-billing',
            'verify-payments',
        ]);
    }
}
