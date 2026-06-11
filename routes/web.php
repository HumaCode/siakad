<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Sistem\RoleController;
use App\Http\Controllers\Sistem\PermissionController;
use App\Http\Controllers\Sistem\MenuController;
use App\Http\Controllers\Sistem\ActivityLogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Sistem Roles & Permissions
    Route::get('/sistem/roles', [RoleController::class, 'index'])->name('sistem.roles.index');
    Route::post('/sistem/roles', [RoleController::class, 'store'])->name('sistem.roles.store');
    Route::put('/sistem/roles/{role}', [RoleController::class, 'update'])->name('sistem.roles.update');
    Route::delete('/sistem/roles/{role}', [RoleController::class, 'destroy'])->name('sistem.roles.destroy');

    Route::get('/sistem/permissions', [PermissionController::class, 'index'])->name('sistem.permissions.index');
    Route::post('/sistem/permissions', [PermissionController::class, 'store'])->name('sistem.permissions.store');
    Route::put('/sistem/permissions/{permission}', [PermissionController::class, 'update'])->name('sistem.permissions.update');
    Route::delete('/sistem/permissions/{permission}', [PermissionController::class, 'destroy'])->name('sistem.permissions.destroy');

    // Sistem Menu Manajemen
    Route::get('/sistem/menu', [MenuController::class, 'index'])->name('sistem.menu.index');
    Route::post('/sistem/menu', [MenuController::class, 'store'])->name('sistem.menu.store');
    Route::put('/sistem/menu/{menu}', [MenuController::class, 'update'])->name('sistem.menu.update');
    Route::delete('/sistem/menu/{menu}', [MenuController::class, 'destroy'])->name('sistem.menu.destroy');

    // Sistem Activity Log
    Route::get('/sistem/activity-log', [ActivityLogController::class, 'index'])->name('sistem.activity-log.index');
    Route::delete('/sistem/activity-log/{activity}', [ActivityLogController::class, 'destroy'])->name('sistem.activity-log.destroy');
    Route::post('/sistem/activity-log/clear-all', [ActivityLogController::class, 'clearAll'])->name('sistem.activity-log.clear-all');
    Route::post('/sistem/activity-log/clear-old', [ActivityLogController::class, 'clearOld'])->name('sistem.activity-log.clear-old');

    // Akademik
    Route::get('/akademik', [\App\Http\Controllers\MainMenu\AkademikController::class, 'index'])->name('akademik.index');
    Route::post('/akademik/prodi', [\App\Http\Controllers\MainMenu\AkademikController::class, 'store'])->name('akademik.prodi.store');
    Route::post('/akademik/prodi/copy', [\App\Http\Controllers\MainMenu\AkademikController::class, 'copyProdi'])->name('akademik.prodi.copy');
    Route::put('/akademik/prodi/{prodi}', [\App\Http\Controllers\MainMenu\AkademikController::class, 'update'])->name('akademik.prodi.update');
    Route::delete('/akademik/prodi/{prodi}', [\App\Http\Controllers\MainMenu\AkademikController::class, 'destroy'])->name('akademik.prodi.destroy');

    Route::post('/akademik/matakuliah', [\App\Http\Controllers\MainMenu\AkademikController::class, 'storeMataKuliah'])->name('akademik.matakuliah.store');
    Route::put('/akademik/matakuliah/{matakuliah}', [\App\Http\Controllers\MainMenu\AkademikController::class, 'updateMataKuliah'])->name('akademik.matakuliah.update');
    Route::delete('/akademik/matakuliah/{matakuliah}', [\App\Http\Controllers\MainMenu\AkademikController::class, 'destroyMataKuliah'])->name('akademik.matakuliah.destroy');

    Route::post('/akademik/jadwal', [\App\Http\Controllers\MainMenu\AkademikController::class, 'storeJadwal'])->name('akademik.jadwal.store');
    Route::put('/akademik/jadwal/{jadwal}', [\App\Http\Controllers\MainMenu\AkademikController::class, 'updateJadwal'])->name('akademik.jadwal.update');
    Route::delete('/akademik/jadwal/{jadwal}', [\App\Http\Controllers\MainMenu\AkademikController::class, 'destroyJadwal'])->name('akademik.jadwal.destroy');

    Route::post('/akademik/kelas', [\App\Http\Controllers\MainMenu\AkademikController::class, 'storeKelas'])->name('akademik.kelas.store');
    Route::put('/akademik/kelas/{kelas}', [\App\Http\Controllers\MainMenu\AkademikController::class, 'updateKelas'])->name('akademik.kelas.update');
    Route::delete('/akademik/kelas/{kelas}', [\App\Http\Controllers\MainMenu\AkademikController::class, 'destroyKelas'])->name('akademik.kelas.destroy');
    Route::post('/akademik/kalender', [\App\Http\Controllers\MainMenu\AkademikController::class, 'storeKalender'])->name('akademik.kalender.store');
    Route::put('/akademik/kalender/{kalender}', [\App\Http\Controllers\MainMenu\AkademikController::class, 'updateKalender'])->name('akademik.kalender.update');
    Route::delete('/akademik/kalender/{kalender}', [\App\Http\Controllers\MainMenu\AkademikController::class, 'destroyKalender'])->name('akademik.kalender.destroy');

    // Mahasiswa Module
    Route::get('/mahasiswa', [\App\Http\Controllers\MainMenu\MahasiswaController::class, 'index'])->name('mahasiswa.index');
    Route::post('/mahasiswa', [\App\Http\Controllers\MainMenu\MahasiswaController::class, 'store'])->name('mahasiswa.store');
    Route::put('/mahasiswa/{id}', [\App\Http\Controllers\MainMenu\MahasiswaController::class, 'update'])->name('mahasiswa.update');
    Route::delete('/mahasiswa/{id}', [\App\Http\Controllers\MainMenu\MahasiswaController::class, 'destroy'])->name('mahasiswa.destroy');
    Route::get('/mahasiswa/{mahasiswa}/document/{collection}', [\App\Http\Controllers\MainMenu\MahasiswaController::class, 'showDocument'])->name('mahasiswa.document');

    // Dosen Module
    Route::get('/dosen', [\App\Http\Controllers\MainMenu\DosenController::class, 'index'])->name('dosen.index');
    Route::post('/dosen', [\App\Http\Controllers\MainMenu\DosenController::class, 'store'])->name('dosen.store');
    Route::put('/dosen/{id}', [\App\Http\Controllers\MainMenu\DosenController::class, 'update'])->name('dosen.update');
    Route::delete('/dosen/{id}', [\App\Http\Controllers\MainMenu\DosenController::class, 'destroy'])->name('dosen.destroy');

    // Staf Non-Dosen Module
    Route::post('/dosen/staf', [\App\Http\Controllers\MainMenu\DosenController::class, 'storeStaf'])->name('dosen.staf.store');
    Route::put('/dosen/staf/{id}', [\App\Http\Controllers\MainMenu\DosenController::class, 'updateStaf'])->name('dosen.staf.update');
    Route::delete('/dosen/staf/{id}', [\App\Http\Controllers\MainMenu\DosenController::class, 'destroyStaf'])->name('dosen.staf.destroy');
});

require __DIR__.'/auth.php';

