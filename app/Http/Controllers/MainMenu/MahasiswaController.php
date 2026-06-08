<?php

namespace App\Http\Controllers\MainMenu;

use App\Http\Controllers\Controller;
use App\Services\MahasiswaService;
use App\Models\Prodi;
use App\Models\Dosen;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class MahasiswaController extends Controller
{
    protected MahasiswaService $mahasiswaService;

    public function __construct(MahasiswaService $mahasiswaService)
    {
        $this->mahasiswaService = $mahasiswaService;
    }

    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $prodiFilter = $request->query('prodi');
        $angkatanFilter = $request->query('angkatan');
        $statusFilter = $request->query('status');

        $mahasiswas = $this->mahasiswaService->getPaginated(15, $search, $prodiFilter, $angkatanFilter, $statusFilter);
        
        $stats = [
            'total' => \App\Models\Mahasiswa::count(),
            'aktif' => \App\Models\Mahasiswa::where('status_akademik', 'Aktif')->count(),
            'cuti' => \App\Models\Mahasiswa::where('status_akademik', 'Cuti')->count(),
            'lulus' => \App\Models\Mahasiswa::where('status_akademik', 'Lulus')->count(),
            'nonaktif' => \App\Models\Mahasiswa::whereIn('status_akademik', ['Non-Aktif', 'Drop Out'])->count(),
        ];

        return Inertia::render('MainMenu/Mahasiswa/Mahasiswa', [
            'mahasiswas' => $mahasiswas,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'prodi' => $prodiFilter,
                'angkatan' => $angkatanFilter,
                'status' => $statusFilter,
            ],
            'all_prodis' => Prodi::orderBy('nama')->get(['id', 'nama', 'jenjang']),
            'all_dosens' => Dosen::with('user')->get()->map(function($d) {
                return [
                    'id' => $d->id,
                    'nama' => $d->user->name ?? 'Unknown',
                    'nidn' => $d->nidn
                ];
            }),
            'angkatan_list' => $this->mahasiswaService->getAngkatanList(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nim' => 'required|string|unique:mahasiswas,nim',
            'nama' => 'required|string|max:255',
            'prodi_id' => 'required|exists:prodis,id',
            'angkatan' => 'required|string|max:4',
            'status_akademik' => 'required|string|in:Aktif,Cuti,Lulus,Drop Out,Non-Aktif',
            'dosen_wali_id' => 'nullable|exists:dosens,id',
        ]);

        $this->mahasiswaService->createMahasiswa($validated);

        return redirect()->back()->with('success', 'Mahasiswa berhasil ditambahkan.');
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $validated = $request->validate([
            'nim' => 'required|string|unique:mahasiswas,nim,' . $id,
            'nama' => 'required|string|max:255',
            'prodi_id' => 'required|exists:prodis,id',
            'angkatan' => 'required|string|max:4',
            'status_akademik' => 'required|string|in:Aktif,Cuti,Lulus,Drop Out,Non-Aktif',
            'dosen_wali_id' => 'nullable|exists:dosens,id',
        ]);

        $this->mahasiswaService->updateMahasiswa($id, $validated);

        return redirect()->back()->with('success', 'Data mahasiswa berhasil diperbarui.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->mahasiswaService->deleteMahasiswa($id);

        return redirect()->back()->with('success', 'Mahasiswa berhasil dihapus.');
    }
}
