<?php

use App\Models\User;
use App\Models\Fakultas;
use App\Models\Prodi;
use App\Models\Dosen;
use Spatie\Permission\Models\Role;

test('authenticated user can access dosen index page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get('/dosen');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('MainMenu/Dosen/Dosen')
    );
});

test('authenticated user can create a new dosen', function () {
    // Create the required Spatie role
    Role::create(['name' => 'dosen']);

    $user = User::factory()->create();

    // Create a Fakultas
    $fakultas = Fakultas::create([
        'kode' => 'FT_TEST',
        'nama' => 'Fakultas Teknik Test',
        'dekan' => 'Dekan Teknik Test'
    ]);

    // Create a prodi
    $prodi = Prodi::create([
        'fakultas_id' => $fakultas->id,
        'kode' => 'PRODTEST',
        'nama' => 'Prodi Test',
        'jenjang' => 'S1',
        'kaprodi' => 'Kaprodi Test',
        'status' => 'Aktif',
        'deskripsi' => 'Desc',
        'sks' => 144,
        'lama_studi' => 8,
        'akreditasi' => 'A',
        'tahun' => 2026
    ]);

    $response = $this->actingAs($user)
        ->post('/dosen', [
            'nidn' => '1234567890',
            'nama' => 'Dosen Test Baru',
            'gelar_depan' => 'Dr.',
            'gelar_belakang' => 'M.T.',
            'email' => 'dosentestbaru@siakad.ac.id',
            'prodi' => 'Prodi Test',
            'jabatan' => 'Lektor',
            'status' => 'Aktif'
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertDatabaseHas('dosens', [
        'nidn' => '1234567890',
        'nama' => 'Dosen Test Baru',
    ]);

    $this->assertDatabaseHas('users', [
        'email' => 'dosentestbaru@siakad.ac.id',
    ]);
});

test('authenticated user can update an existing dosen', function () {
    $user = User::factory()->create();

    // Create a Fakultas
    $fakultas = Fakultas::create([
        'kode' => 'FT_TEST',
        'nama' => 'Fakultas Teknik Test',
        'dekan' => 'Dekan Teknik Test'
    ]);

    // Create a prodi
    $prodi = Prodi::create([
        'fakultas_id' => $fakultas->id,
        'kode' => 'PRODTEST',
        'nama' => 'Prodi Test',
        'jenjang' => 'S1',
        'kaprodi' => 'Kaprodi Test',
        'status' => 'Aktif',
        'deskripsi' => 'Desc',
        'sks' => 144,
        'lama_studi' => 8,
        'akreditasi' => 'A',
        'tahun' => 2026
    ]);

    $dosenUser = User::create([
        'name' => 'Original Dosen',
        'email' => 'orig@siakad.ac.id',
        'password' => bcrypt('password')
    ]);

    $dosen = Dosen::create([
        'user_id' => $dosenUser->id,
        'nidn' => '9876543210',
        'nama' => 'Original Dosen',
        'prodi_id' => $prodi->id,
        'status_dosen' => 'tetap'
    ]);

    $response = $this->actingAs($user)
        ->put("/dosen/{$dosen->id}", [
            'nidn' => '9876543210',
            'nama' => 'Updated Dosen Name',
            'gelar_depan' => 'Dr.',
            'gelar_belakang' => 'Ph.D',
            'email' => 'updateddosen@siakad.ac.id',
            'prodi' => 'Prodi Test',
            'jabatan' => 'Lektor Kepala',
            'status' => 'Aktif'
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertDatabaseHas('dosens', [
        'id' => $dosen->id,
        'nama' => 'Updated Dosen Name',
    ]);

    $this->assertDatabaseHas('users', [
        'id' => $dosenUser->id,
        'email' => 'updateddosen@siakad.ac.id',
    ]);
});

test('authenticated user can delete an existing dosen', function () {
    $user = User::factory()->create();

    // Create a Fakultas
    $fakultas = Fakultas::create([
        'kode' => 'FT_TEST',
        'nama' => 'Fakultas Teknik Test',
        'dekan' => 'Dekan Teknik Test'
    ]);

    // Create a prodi
    $prodi = Prodi::create([
        'fakultas_id' => $fakultas->id,
        'kode' => 'PRODTEST',
        'nama' => 'Prodi Test',
        'jenjang' => 'S1',
        'kaprodi' => 'Kaprodi Test',
        'status' => 'Aktif',
        'deskripsi' => 'Desc',
        'sks' => 144,
        'lama_studi' => 8,
        'akreditasi' => 'A',
        'tahun' => 2026
    ]);

    $dosenUser = User::create([
        'name' => 'Delete Dosen',
        'email' => 'delete@siakad.ac.id',
        'password' => bcrypt('password')
    ]);

    $dosen = Dosen::create([
        'user_id' => $dosenUser->id,
        'nidn' => '5555555555',
        'nama' => 'Delete Dosen',
        'prodi_id' => $prodi->id,
        'status_dosen' => 'tetap'
    ]);

    $response = $this->actingAs($user)
        ->delete("/dosen/{$dosen->id}");

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertSoftDeleted('dosens', [
        'id' => $dosen->id
    ]);

    $this->assertDatabaseHas('users', [
        'id' => $dosenUser->id
    ]);
});
