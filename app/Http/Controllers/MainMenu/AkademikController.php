<?php

namespace App\Http\Controllers\MainMenu;

use App\Http\Controllers\Controller;
use App\Models\Prodi;
use App\Models\Dosen;
use App\Models\Ruangan;
use App\Models\Fakultas;
use Inertia\Inertia;
use Inertia\Response;

class AkademikController extends Controller
{
    /**
     * Display the academic dashboard.
     */
    public function index(): Response
    {
        $stats = [
            'prodi_count' => Prodi::count(),
            'dosen_count' => Dosen::count(),
            'ruangan_count' => Ruangan::count(),
        ];

        $fakultas = Fakultas::orderBy('nama')->get(['id', 'nama', 'kode']);

        return Inertia::render('MainMenu/Akademik/Akademik', [
            'stats' => $stats,
            'fakultas' => $fakultas,
        ]);
    }
}
