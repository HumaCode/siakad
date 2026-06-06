<?php

use App\Models\User;
use App\Models\Fakultas;
use App\Models\Prodi;
use Inertia\Testing\AssertableInertia as Assert;

test('guest cannot access akademik page', function () {
    $this->get('/akademik')
        ->assertRedirect('/login');
});

test('authenticated user can access akademik page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/akademik')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('MainMenu/Akademik/Akademik')
            ->has('stats')
            ->has('fakultas')
            ->has('prodis')
        );
});

test('authenticated user can store a new prodi', function () {
    $user = User::factory()->create();
    $fakultas = Fakultas::create([
        'kode' => 'FT_TEST',
        'nama' => 'Fakultas Teknik Test',
        'dekan' => 'Dekan Teknik Test'
    ]);

    $this->actingAs($user)
        ->post('/akademik/prodi', [
            'fakultas_id' => $fakultas->id,
            'kode' => 'TISTEST',
            'nama' => 'Teknik Industri Test',
            'jenjang' => 'S1',
            'kaprodi' => 'Kaprodi Industri Test',
            'status' => 'Aktif'
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertDatabaseHas('prodis', [
        'kode' => 'TISTEST',
        'nama' => 'Teknik Industri Test',
        'jenjang' => 'S1',
        'kaprodi' => 'Kaprodi Industri Test',
        'status' => 'Aktif'
    ]);
});
