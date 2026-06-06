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
            'status' => 'Aktif',
            'deskripsi' => 'Deskripsi Test',
            'sks' => 144,
            'lama_studi' => 8,
            'akreditasi' => 'Unggul',
            'tahun' => 2024
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertDatabaseHas('prodis', [
        'kode' => 'TISTEST',
        'nama' => 'Teknik Industri Test',
        'jenjang' => 'S1',
        'kaprodi' => 'Kaprodi Industri Test',
        'status' => 'Aktif',
        'deskripsi' => 'Deskripsi Test',
        'sks' => 144,
        'lama_studi' => 8,
        'akreditasi' => 'Unggul',
        'tahun' => 2024
    ]);
});

test('authenticated user can update an existing prodi', function () {
    $user = User::factory()->create();
    $fakultas = Fakultas::create([
        'kode' => 'FT_TEST',
        'nama' => 'Fakultas Teknik Test',
        'dekan' => 'Dekan Teknik Test'
    ]);

    $prodi = Prodi::create([
        'fakultas_id' => $fakultas->id,
        'kode' => 'TISTEST',
        'nama' => 'Teknik Industri Test',
        'jenjang' => 'S1',
        'kaprodi' => 'Kaprodi Industri Test',
        'status' => 'Aktif',
        'deskripsi' => 'Deskripsi Test',
        'sks' => 144,
        'lama_studi' => 8,
        'akreditasi' => 'Unggul',
        'tahun' => 2024
    ]);

    $this->actingAs($user)
        ->put("/akademik/prodi/{$prodi->id}", [
            'fakultas_id' => $fakultas->id,
            'kode' => 'TISTEST',
            'nama' => 'Teknik Industri Updated',
            'jenjang' => 'S2',
            'kaprodi' => 'Kaprodi Baru',
            'status' => 'Revisi',
            'deskripsi' => 'Deskripsi Updated',
            'sks' => 140,
            'lama_studi' => 8,
            'akreditasi' => 'A',
            'tahun' => 2025
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertDatabaseHas('prodis', [
        'id' => $prodi->id,
        'kode' => 'TISTEST',
        'nama' => 'Teknik Industri Updated',
        'jenjang' => 'S2',
        'kaprodi' => 'Kaprodi Baru',
        'status' => 'Revisi',
        'deskripsi' => 'Deskripsi Updated',
        'sks' => 140,
        'lama_studi' => 8,
        'akreditasi' => 'A',
        'tahun' => 2025
    ]);
});

test('authenticated user can delete an existing prodi', function () {
    $user = User::factory()->create();
    $fakultas = Fakultas::create([
        'kode' => 'FT_TEST',
        'nama' => 'Fakultas Teknik Test',
        'dekan' => 'Dekan Teknik Test'
    ]);

    $prodi = Prodi::create([
        'fakultas_id' => $fakultas->id,
        'kode' => 'TISTEST',
        'nama' => 'Teknik Industri Test',
        'jenjang' => 'S1',
        'kaprodi' => 'Kaprodi Industri Test',
        'status' => 'Aktif',
        'deskripsi' => 'Deskripsi Test',
        'sks' => 144,
        'lama_studi' => 8,
        'akreditasi' => 'Unggul',
        'tahun' => 2024
    ]);

    $this->actingAs($user)
        ->delete("/akademik/prodi/{$prodi->id}")
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertSoftDeleted('prodis', [
        'id' => $prodi->id
    ]);
});
