<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Sistem\RoleController;
use App\Http\Controllers\Sistem\PermissionController;
use App\Http\Controllers\Sistem\MenuController;
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
});

require __DIR__.'/auth.php';

