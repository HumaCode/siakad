<?php

use App\Models\User;
use App\Models\Fakultas;
use App\Models\Prodi;
use App\Models\Mahasiswa;

test('authenticated user can delete an existing mahasiswa', function () {
    $user = User::factory()->create();

    // Create a Fakultas
    $fakultas = Fakultas::create([
        'kode' => 'FT_TEST',
        'nama' => 'Fakultas Teknik Test',
        'dekan' => 'Dekan Teknik Test'
    ]);

    // Create a prodi first
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

    // Create a student user account
    $studentUser = User::create([
        'name' => 'Student Test',
        'email' => 'studenttest@student.siakad.ac.id',
        'password' => bcrypt('password')
    ]);

    // Create mahasiswa record
    $mahasiswa = Mahasiswa::create([
        'user_id' => $studentUser->id,
        'nim' => '123456789',
        'nama' => 'Student Test',
        'prodi_id' => $prodi->id,
        'angkatan' => '2026',
        'status_akademik' => 'Aktif',
        'email_pribadi' => 'studenttest@gmail.com'
    ]);

    // Perform the delete request
    $response = $this->actingAs($user)
        ->delete("/mahasiswa/{$mahasiswa->id}");

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    // Assert student user is deleted (hard deleted because User model doesn't use SoftDeletes)
    $this->assertDatabaseMissing('users', [
        'id' => $studentUser->id
    ]);

    // Assert student record is deleted from database (due to database cascade deletion)
    $this->assertDatabaseMissing('mahasiswas', [
        'id' => $mahasiswa->id
    ]);
});

test('authenticated user can access paginated mahasiswa page', function () {
    $user = User::factory()->create();

    // Create a Fakultas
    $fakultas = Fakultas::create([
        'kode' => 'FT_TEST',
        'nama' => 'Fakultas Teknik Test',
        'dekan' => 'Dekan Teknik Test'
    ]);

    // Create a prodi first
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

    // Create 20 students to trigger pagination (since pagination size is 15)
    for ($i = 1; $i <= 20; $i++) {
        $studentUser = User::create([
            'name' => "Student Test {$i}",
            'email' => "studenttest{$i}@student.siakad.ac.id",
            'password' => bcrypt('password')
        ]);

        Mahasiswa::create([
            'user_id' => $studentUser->id,
            'nim' => "12345678{$i}",
            'nama' => "Student Test {$i}",
            'prodi_id' => $prodi->id,
            'angkatan' => '2026',
            'status_akademik' => 'Aktif',
            'email_pribadi' => "studenttest{$i}@gmail.com"
        ]);
    }

    $response = $this->actingAs($user)
        ->get('/mahasiswa?page=2&angkatan=2026');

    $response->assertOk();
    
    // Assert pagination structure exists in the response
    $response->assertInertia(fn ($page) => $page
        ->component('MainMenu/Mahasiswa/Mahasiswa')
        ->where('mahasiswas.current_page', 2)
        ->where('mahasiswas.last_page', 2)
        ->where('mahasiswas.total', 20)
    );
});
