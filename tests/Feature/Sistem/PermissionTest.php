<?php

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Inertia\Testing\AssertableInertia as Assert;

test('guest cannot access permissions page', function () {
    $this->get('/sistem/permissions')
        ->assertRedirect('/login');
});

test('authenticated user can access permissions page', function () {
    $user = User::factory()->create();
    $role = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
    $user->assignRole($role);

    // Ensure at least one permission exists
    Permission::firstOrCreate(['name' => 'sistem.permissions.index', 'guard_name' => 'web']);

    $this->actingAs($user)
        ->get('/sistem/permissions')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Sistem/Permissions')
            ->has('permissions')
            ->has('filters')
            ->has('stats')
        );
});

test('authenticated user can create a new permission', function () {
    $this->withoutMiddleware();
    
    $user = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
    $user->assignRole($adminRole);

    $this->actingAs($user)
        ->post('/sistem/permissions', [
            'name' => 'sistem.permissions.create-test',
            'guard_name' => 'web',
            'is_active' => true,
        ])
        ->assertRedirect('/sistem/permissions');

    $this->assertDatabaseHas('permissions', [
        'name' => 'sistem.permissions.create-test',
        'guard_name' => 'web',
        'is_active' => true,
    ]);
});

test('authenticated user can update an existing permission', function () {
    $this->withoutMiddleware();

    $user = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
    $user->assignRole($adminRole);

    $targetPermission = Permission::create([
        'name' => 'sistem.permissions.update-target',
        'guard_name' => 'web',
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->put("/sistem/permissions/{$targetPermission->id}", [
            'name' => 'sistem.permissions.update-target-edited',
            'guard_name' => 'web',
            'is_active' => false,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect('/sistem/permissions');

    $this->assertDatabaseHas('permissions', [
        'id' => $targetPermission->id,
        'name' => 'sistem.permissions.update-target-edited',
        'guard_name' => 'web',
        'is_active' => false,
    ]);
});

test('authenticated user can delete a permission', function () {
    $this->withoutMiddleware();

    $user = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
    $user->assignRole($adminRole);

    $targetPermission = Permission::create([
        'name' => 'sistem.permissions.delete-target',
        'guard_name' => 'web',
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->delete("/sistem/permissions/{$targetPermission->id}")
        ->assertRedirect('/sistem/permissions');

    $this->assertDatabaseMissing('permissions', [
        'id' => $targetPermission->id
    ]);
});
