<?php

use App\Models\User;
use App\Models\Fakultas;
use App\Models\Prodi;
use App\Models\Mahasiswa;
use Spatie\Permission\Models\Role;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

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

test('uploaded JPEG and PNG images are converted to WebP format', function () {
    Storage::fake('public');

    // Create the required Spatie role
    Role::create(['name' => 'mahasiswa']);

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

    // Create a dummy JPEG file
    $foto = UploadedFile::fake()->image('profile.jpg');
    // Create a dummy PNG file for KTP
    $ktp = UploadedFile::fake()->image('ktp.png');

    $response = $this->actingAs($user)
        ->post('/mahasiswa', [
            'nim' => '1234567890',
            'nama' => 'Student WebP Test',
            'prodi_id' => $prodi->id,
            'angkatan' => '2026',
            'status_akademik' => 'Aktif',
            'email_akademik' => 'studentwebp@student.siakad.ac.id',
            'foto' => $foto,
            'ktp' => $ktp
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $mahasiswa = Mahasiswa::where('nim', '1234567890')->first();
    expect($mahasiswa)->not->toBeNull();

    // Get the photo and KTP media items
    $fotoMedia = $mahasiswa->getFirstMedia('foto');
    expect($fotoMedia)->not->toBeNull();
    expect($fotoMedia->mime_type)->toBe('image/webp');
    expect(pathinfo($fotoMedia->file_name, PATHINFO_EXTENSION))->toBe('webp');

    $ktpMedia = $mahasiswa->getFirstMedia('ktp');
    expect($ktpMedia)->not->toBeNull();
    expect($ktpMedia->mime_type)->toBe('image/webp');
    expect(pathinfo($ktpMedia->file_name, PATHINFO_EXTENSION))->toBe('webp');
});
