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
            ->has('mata_kuliahs')
            ->has('all_prodis')
            ->has('all_dosens')
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

test('authenticated user can store a new mata kuliah', function () {
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
    $dosenUser = User::factory()->create();
    $dosen = \App\Models\Dosen::create([
        'user_id' => $dosenUser->id,
        'nidn' => '1234567890',
        'nama' => 'Dosen Pengampu Test',
        'prodi_id' => $prodi->id,
        'status_dosen' => 'tetap'
    ]);

    $this->actingAs($user)
        ->post('/akademik/matakuliah', [
            'prodi_id' => $prodi->id,
            'kode' => 'MKTEST1',
            'nama' => 'Mata Kuliah Test',
            'sks_teori' => 2,
            'sks_praktik' => 1,
            'sem' => 3,
            'jenis' => 'Wajib',
            'prasyarat' => 'MKPRE',
            'dosen_id' => $dosen->id,
            'deskripsi' => 'Deskripsi MK Test',
            'status' => 'Aktif'
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertDatabaseHas('mata_kuliahs', [
        'prodi_id' => $prodi->id,
        'kode' => 'MKTEST1',
        'nama' => 'Mata Kuliah Test',
        'sks' => 3,
        'sem' => 3,
        'jenis' => 'Wajib',
        'prasyarat' => 'MKPRE',
        'dosen_id' => $dosen->id,
        'status' => 'Aktif'
    ]);
});

test('authenticated user can update an existing mata kuliah', function () {
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
    $dosenUser = User::factory()->create();
    $dosen = \App\Models\Dosen::create([
        'user_id' => $dosenUser->id,
        'nidn' => '1234567890',
        'nama' => 'Dosen Pengampu Test',
        'prodi_id' => $prodi->id,
        'status_dosen' => 'tetap'
    ]);
    $matakuliah = \App\Models\MataKuliah::create([
        'prodi_id' => $prodi->id,
        'kode' => 'MKTEST1',
        'nama' => 'Mata Kuliah Test',
        'sks' => 3,
        'sem' => 3,
        'jenis' => 'Wajib',
        'prasyarat' => 'MKPRE',
        'dosen_id' => $dosen->id,
        'deskripsi' => 'Deskripsi MK Test',
        'status' => 'Aktif'
    ]);

    $this->actingAs($user)
        ->put("/akademik/matakuliah/{$matakuliah->id}", [
            'prodi_id' => $prodi->id,
            'kode' => 'MKTEST1',
            'nama' => 'Mata Kuliah Updated',
            'sks_teori' => 3,
            'sks_praktik' => 1,
            'sem' => 4,
            'jenis' => 'Pilihan',
            'prasyarat' => 'MKPRE_NEW',
            'dosen_id' => $dosen->id,
            'deskripsi' => 'Deskripsi MK Updated',
            'status' => 'Nonaktif'
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertDatabaseHas('mata_kuliahs', [
        'id' => $matakuliah->id,
        'prodi_id' => $prodi->id,
        'kode' => 'MKTEST1',
        'nama' => 'Mata Kuliah Updated',
        'sks' => 4,
        'sem' => 4,
        'jenis' => 'Pilihan',
        'prasyarat' => 'MKPRE_NEW',
        'dosen_id' => $dosen->id,
        'status' => 'Nonaktif'
    ]);
});

test('authenticated user can delete an existing mata kuliah', function () {
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
    $dosenUser = User::factory()->create();
    $dosen = \App\Models\Dosen::create([
        'user_id' => $dosenUser->id,
        'nidn' => '1234567890',
        'nama' => 'Dosen Pengampu Test',
        'prodi_id' => $prodi->id,
        'status_dosen' => 'tetap'
    ]);
    $matakuliah = \App\Models\MataKuliah::create([
        'prodi_id' => $prodi->id,
        'kode' => 'MKTEST1',
        'nama' => 'Mata Kuliah Test',
        'sks' => 3,
        'sem' => 3,
        'jenis' => 'Wajib',
        'prasyarat' => 'MKPRE',
        'dosen_id' => $dosen->id,
        'deskripsi' => 'Deskripsi MK Test',
        'status' => 'Aktif'
    ]);

    $this->actingAs($user)
        ->delete("/akademik/matakuliah/{$matakuliah->id}")
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertSoftDeleted('mata_kuliahs', [
        'id' => $matakuliah->id
    ]);
});

test('authenticated user can store a new jadwal kuliah', function () {
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
    $dosenUser = User::factory()->create();
    $dosen = \App\Models\Dosen::create([
        'user_id' => $dosenUser->id,
        'nidn' => '1234567890',
        'nama' => 'Dosen Pengampu Test',
        'prodi_id' => $prodi->id,
        'status_dosen' => 'tetap'
    ]);
    $matakuliah = \App\Models\MataKuliah::create([
        'prodi_id' => $prodi->id,
        'kode' => 'MKTEST1',
        'nama' => 'Mata Kuliah Test',
        'sks' => 3,
        'sem' => 3,
        'jenis' => 'Wajib',
        'prasyarat' => 'MKPRE',
        'dosen_id' => $dosen->id,
        'deskripsi' => 'Deskripsi MK Test',
        'status' => 'Aktif'
    ]);
    $ruangan = \App\Models\Ruangan::create([
        'nama_gedung' => 'Gedung Test',
        'nama_ruangan' => 'Ruang 101 Test',
        'kapasitas' => 30
    ]);
    $kelas = \App\Models\Kelas::create([
        'prodi_id' => $prodi->id,
        'nama' => 'Kelas A',
        'status' => 'Aktif'
    ]);

    $this->actingAs($user)
        ->post('/akademik/jadwal', [
            'mata_kuliah_id' => $matakuliah->id,
            'hari' => 'Senin',
            'kelas_id' => $kelas->id,
            'jam_mulai' => '07:00',
            'jam_selesai' => '08:40',
            'ruangan_id' => $ruangan->id,
            'tipe' => 'Teori'
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertDatabaseHas('jadwal_kuliahs', [
        'mata_kuliah_id' => $matakuliah->id,
        'hari' => 'Senin',
        'kelas_id' => $kelas->id,
        'jam_mulai' => '07:00',
        'jam_selesai' => '08:40',
        'ruangan_id' => $ruangan->id,
        'tipe' => 'Teori',
        'prodi_id' => $prodi->id,
        'dosen_id' => $dosen->id
    ]);
});

test('authenticated user can update an existing jadwal kuliah', function () {
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
    $dosenUser = User::factory()->create();
    $dosen = \App\Models\Dosen::create([
        'user_id' => $dosenUser->id,
        'nidn' => '1234567890',
        'nama' => 'Dosen Pengampu Test',
        'prodi_id' => $prodi->id,
        'status_dosen' => 'tetap'
    ]);
    $matakuliah = \App\Models\MataKuliah::create([
        'prodi_id' => $prodi->id,
        'kode' => 'MKTEST1',
        'nama' => 'Mata Kuliah Test',
        'sks' => 3,
        'sem' => 3,
        'jenis' => 'Wajib',
        'prasyarat' => 'MKPRE',
        'dosen_id' => $dosen->id,
        'deskripsi' => 'Deskripsi MK Test',
        'status' => 'Aktif'
    ]);
    $ruangan = \App\Models\Ruangan::create([
        'nama_gedung' => 'Gedung Test',
        'nama_ruangan' => 'Ruang 101 Test',
        'kapasitas' => 30
    ]);
    $kelasA = \App\Models\Kelas::create([
        'prodi_id' => $prodi->id,
        'nama' => 'Kelas A',
        'status' => 'Aktif'
    ]);
    $kelasB = \App\Models\Kelas::create([
        'prodi_id' => $prodi->id,
        'nama' => 'Kelas B',
        'status' => 'Aktif'
    ]);
    $jadwal = \App\Models\JadwalKuliah::create([
        'mata_kuliah_id' => $matakuliah->id,
        'hari' => 'Senin',
        'kelas_id' => $kelasA->id,
        'jam_mulai' => '07:00',
        'jam_selesai' => '08:40',
        'ruangan_id' => $ruangan->id,
        'tipe' => 'Teori',
        'prodi_id' => $prodi->id,
        'dosen_id' => $dosen->id
    ]);

    $this->actingAs($user)
        ->put("/akademik/jadwal/{$jadwal->id}", [
            'mata_kuliah_id' => $matakuliah->id,
            'hari' => 'Selasa',
            'kelas_id' => $kelasB->id,
            'jam_mulai' => '08:40',
            'jam_selesai' => '10:20',
            'ruangan_id' => $ruangan->id,
            'tipe' => 'Praktikum'
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertDatabaseHas('jadwal_kuliahs', [
        'id' => $jadwal->id,
        'hari' => 'Selasa',
        'kelas_id' => $kelasB->id,
        'jam_mulai' => '08:40',
        'jam_selesai' => '10:20',
        'tipe' => 'Praktikum'
    ]);
});

test('authenticated user can delete an existing jadwal kuliah', function () {
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
    $dosenUser = User::factory()->create();
    $dosen = \App\Models\Dosen::create([
        'user_id' => $dosenUser->id,
        'nidn' => '1234567890',
        'nama' => 'Dosen Pengampu Test',
        'prodi_id' => $prodi->id,
        'status_dosen' => 'tetap'
    ]);
    $matakuliah = \App\Models\MataKuliah::create([
        'prodi_id' => $prodi->id,
        'kode' => 'MKTEST1',
        'nama' => 'Mata Kuliah Test',
        'sks' => 3,
        'sem' => 3,
        'jenis' => 'Wajib',
        'prasyarat' => 'MKPRE',
        'dosen_id' => $dosen->id,
        'deskripsi' => 'Deskripsi MK Test',
        'status' => 'Aktif'
    ]);
    $ruangan = \App\Models\Ruangan::create([
        'nama_gedung' => 'Gedung Test',
        'nama_ruangan' => 'Ruang 101 Test',
        'kapasitas' => 30
    ]);
    $kelas = \App\Models\Kelas::create([
        'prodi_id' => $prodi->id,
        'nama' => 'Kelas A',
        'status' => 'Aktif'
    ]);
    $jadwal = \App\Models\JadwalKuliah::create([
        'mata_kuliah_id' => $matakuliah->id,
        'hari' => 'Senin',
        'kelas_id' => $kelas->id,
        'jam_mulai' => '07:00',
        'jam_selesai' => '08:40',
        'ruangan_id' => $ruangan->id,
        'tipe' => 'Teori',
        'prodi_id' => $prodi->id,
        'dosen_id' => $dosen->id
    ]);

    $this->actingAs($user)
        ->delete("/akademik/jadwal/{$jadwal->id}")
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertSoftDeleted('jadwal_kuliahs', [
        'id' => $jadwal->id
    ]);
});

test('authenticated user can store a new kelas', function () {
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
        ->post('/akademik/kelas', [
            'prodi_id' => $prodi->id,
            'nama' => 'Kelas Baru Test',
            'status' => 'Aktif'
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertDatabaseHas('kelas', [
        'prodi_id' => $prodi->id,
        'nama' => 'Kelas Baru Test',
        'status' => 'Aktif'
    ]);
});

test('authenticated user can update an existing kelas', function () {
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
    $kelas = \App\Models\Kelas::create([
        'prodi_id' => $prodi->id,
        'nama' => 'Kelas A',
        'status' => 'Aktif'
    ]);

    $this->actingAs($user)
        ->put("/akademik/kelas/{$kelas->id}", [
            'prodi_id' => $prodi->id,
            'nama' => 'Kelas A Updated',
            'status' => 'Nonaktif'
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertDatabaseHas('kelas', [
        'id' => $kelas->id,
        'nama' => 'Kelas A Updated',
        'status' => 'Nonaktif'
    ]);
});

test('authenticated user can delete an existing kelas', function () {
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
    $kelas = \App\Models\Kelas::create([
        'prodi_id' => $prodi->id,
        'nama' => 'Kelas A',
        'status' => 'Aktif'
    ]);

    $this->actingAs($user)
        ->delete("/akademik/kelas/{$kelas->id}")
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertSoftDeleted('kelas', [
        'id' => $kelas->id
    ]);
});
