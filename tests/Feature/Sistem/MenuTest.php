<?php

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Models\Konfigurasi\Menu;
use Inertia\Testing\AssertableInertia as Assert;

test('guest cannot access menus page', function () {
    $this->get('/sistem/menu')
        ->assertRedirect('/login');
});

test('authenticated user can access menus page', function () {
    $user = User::factory()->create();
    $role = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
    $user->assignRole($role);

    // Ensure at least one menu exists
    Menu::updateOrCreate(
        ['url' => 'test-menu'],
        [
            'name' => 'Test Menu',
            'category' => 'MAIN MENU',
            'icon' => 'gear',
            'active' => true,
            'orders' => 1,
            'main_menu_id' => null,
        ]
    );

    $this->actingAs($user)
        ->get('/sistem/menu')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Sistem/Menus')
            ->has('menus')
            ->has('filters')
            ->has('stats')
            ->has('parentMenus')
            ->has('permissionsList')
        );
});

test('authenticated user can create a new menu', function () {
    $this->withoutMiddleware();

    $user = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
    $user->assignRole($adminRole);

    $permission = Permission::firstOrCreate(['name' => 'sistem.menu.index', 'guard_name' => 'web']);

    $this->actingAs($user)
        ->post('/sistem/menu', [
            'name' => 'Menu Baru',
            'url' => 'sistem/menu-baru',
            'category' => 'SISTEM',
            'icon' => 'bi-menu',
            'active' => true,
            'orders' => 5,
            'main_menu_id' => null,
            'permissions' => [$permission->id],
        ])
        ->assertRedirect('/sistem/menu');

    $this->assertDatabaseHas('menus', [
        'name' => 'Menu Baru',
        'url' => 'sistem/menu-baru',
        'category' => 'SISTEM',
        'icon' => 'bi-menu',
        'active' => true,
        'orders' => 5,
    ]);

    $newMenu = Menu::where('url', 'sistem/menu-baru')->first();
    $this->assertTrue($newMenu->permissions->contains($permission->id));
});

test('authenticated user can update an existing menu', function () {
    $this->withoutMiddleware();

    $user = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
    $user->assignRole($adminRole);

    $menu = Menu::updateOrCreate(
        ['url' => 'sistem/menu-edit-target'],
        [
            'name' => 'Target Edit',
            'category' => 'SISTEM',
            'icon' => 'bi-gear',
            'active' => true,
            'orders' => 2,
            'main_menu_id' => null,
        ]
    );

    $permission = Permission::firstOrCreate(['name' => 'sistem.menu.edit', 'guard_name' => 'web']);

    $this->actingAs($user)
        ->put("/sistem/menu/{$menu->id}", [
            'name' => 'Target Edit Berhasil',
            'url' => 'sistem/menu-edit-target-edited',
            'category' => 'MAIN MENU',
            'icon' => 'bi-pencil',
            'active' => false,
            'orders' => 10,
            'main_menu_id' => null,
            'permissions' => [$permission->id],
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect('/sistem/menu');

    $this->assertDatabaseHas('menus', [
        'id' => $menu->id,
        'name' => 'Target Edit Berhasil',
        'url' => 'sistem/menu-edit-target-edited',
        'category' => 'MAIN MENU',
        'icon' => 'bi-pencil',
        'active' => false,
        'orders' => 10,
    ]);

    $menu->refresh();
    $this->assertTrue($menu->permissions->contains($permission->id));
});

test('authenticated user can delete a menu', function () {
    $this->withoutMiddleware();

    $user = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
    $user->assignRole($adminRole);

    $menu = Menu::updateOrCreate(
        ['url' => 'sistem/menu-delete-target'],
        [
            'name' => 'Target Hapus',
            'category' => 'SISTEM',
            'icon' => 'bi-trash',
            'active' => true,
            'orders' => 3,
            'main_menu_id' => null,
        ]
    );

    $this->actingAs($user)
        ->delete("/sistem/menu/{$menu->id}")
        ->assertRedirect('/sistem/menu');

    $this->assertDatabaseMissing('menus', [
        'id' => $menu->id
    ]);
});
