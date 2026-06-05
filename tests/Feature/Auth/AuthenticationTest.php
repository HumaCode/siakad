<?php
 
use App\Models\User;
use App\Models\Fakultas;
use App\Models\Prodi;
use App\Models\Mahasiswa;
use App\Models\Dosen;

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('mahasiswa can authenticate using NIM', function () {
    $fakultas = Fakultas::create([
        'kode' => 'FT',
        'nama' => 'Fakultas Teknik',
    ]);
    
    $prodi = Prodi::create([
        'fakultas_id' => $fakultas->id,
        'kode' => 'IF',
        'nama' => 'Informatika',
        'jenjang' => 'S1',
    ]);

    $user = User::factory()->create();

    $mahasiswa = Mahasiswa::create([
        'user_id' => $user->id,
        'nim' => '251011526101',
        'nama' => $user->name,
        'prodi_id' => $prodi->id,
        'angkatan' => 2025,
        'status_akademik' => 'aktif',
    ]);

    $response = $this->post('/login', [
        'email' => '251011526101',
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('dosen can authenticate using NIDN', function () {
    $fakultas = Fakultas::create([
        'kode' => 'FT',
        'nama' => 'Fakultas Teknik',
    ]);
    
    $prodi = Prodi::create([
        'fakultas_id' => $fakultas->id,
        'kode' => 'IF',
        'nama' => 'Informatika',
        'jenjang' => 'S1',
    ]);

    $user = User::factory()->create();

    $dosen = Dosen::create([
        'user_id' => $user->id,
        'nidn' => '0412038901',
        'nama' => $user->name,
        'prodi_id' => $prodi->id,
        'status_dosen' => 'tetap',
    ]);

    $response = $this->post('/login', [
        'email' => '0412038901',
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});
