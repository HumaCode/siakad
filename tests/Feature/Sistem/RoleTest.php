<?php

use App\Models\User;
use App\Models\Role;
use Inertia\Testing\AssertableInertia as Assert;

test('guest cannot access roles page', function () {
    $this->get('/sistem/roles')
        ->assertRedirect('/login');
});

test('authenticated user can access roles page', function () {
    // We create a user and assign a role
    $user = User::factory()->create();
    
    // Seed Spatie role if needed, or get one
    $role = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
    $user->assignRole($role);

    $this->actingAs($user)
        ->get('/sistem/roles')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Sistem/Roles')
            ->has('roles')
            ->has('permissions')
            ->has('users')
            ->has('stats')
        );
});

test('authenticated user can create a new role', function () {
    $this->withoutMiddleware();
    
    $user = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
    $user->assignRole($adminRole);

    $this->actingAs($user)
        ->post('/sistem/roles', [
            'name' => 'akademik_staff',
            'slug' => 'akademik_staff',
            'type_role' => 'akademik',
            'color' => 'blue',
            'priority' => 2,
            'is_active' => true,
            'description' => 'Staff akademik description',
            'guard_name' => 'web',
            'permissions' => [],
        ])
        ->assertRedirect('/sistem/roles');

    $this->assertDatabaseHas('roles', [
        'name' => 'akademik_staff',
        'slug' => 'akademik_staff',
        'type_role' => 'akademik',
        'color' => 'blue',
        'priority' => 2,
        'is_active' => true,
    ]);
});

test('authenticated user can update an existing role', function () {
    $this->withoutMiddleware();

    $user = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
    $user->assignRole($adminRole);

    $targetRole = Role::create([
        'name' => 'editor',
        'slug' => 'editor',
        'type_role' => 'lainnya',
        'color' => 'slate',
        'priority' => 10,
        'is_active' => true,
        'guard_name' => 'web'
    ]);

    $this->actingAs($user)
        ->put("/sistem/roles/{$targetRole->id}", [
            'name' => 'editor_update',
            'slug' => 'editor_update',
            'type_role' => 'akademik',
            'color' => 'rose',
            'priority' => 5,
            'is_active' => false,
            'description' => 'Updated editor description',
            'guard_name' => 'web',
            'permissions' => [],
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect('/sistem/roles');

    $this->assertDatabaseHas('roles', [
        'id' => $targetRole->id,
        'name' => 'editor_update',
        'slug' => 'editor_update',
        'type_role' => 'akademik',
        'color' => 'rose',
        'priority' => 5,
        'is_active' => false,
    ]);
});
