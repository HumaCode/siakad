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
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web'
            ]);
        }

        // Clear cache again to make sure all newly created permissions are in cache
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Create Roles and Assign Permissions

        // 1. Super Admin
        $superAdminRole = Role::firstOrCreate([
            'name' => 'super_admin',
            'guard_name' => 'web'
        ]);

        // 2. Admin
        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web'
        ]);
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
        $akademikRole = Role::firstOrCreate([
            'name' => 'akademik',
            'guard_name' => 'web'
        ]);
        $akademikRole->givePermissionTo([
            'manage-academic-years',
            'manage-curriculums',
            'manage-subjects',
            'manage-schedules',
            'manage-krs',
        ]);

        // 4. Dosen
        $dosenRole = Role::firstOrCreate([
            'name' => 'dosen',
            'guard_name' => 'web'
        ]);
        $dosenRole->givePermissionTo([
            'view-teaching-schedule',
            'approve-krs',
            'input-attendance',
            'input-grades',
        ]);

        // 5. Mahasiswa
        $mahasiswaRole = Role::firstOrCreate([
            'name' => 'mahasiswa',
            'guard_name' => 'web'
        ]);
        $mahasiswaRole->givePermissionTo([
            'submit-krs',
            'view-grades',
            'view-schedule',
            'view-attendance',
            'view-billing',
        ]);

        // 6. Keuangan
        $keuanganRole = Role::firstOrCreate([
            'name' => 'keuangan',
            'guard_name' => 'web'
        ]);
        $keuanganRole->givePermissionTo([
            'manage-billing',
            'verify-payments',
        ]);
    }
}
