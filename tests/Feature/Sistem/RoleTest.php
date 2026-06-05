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
