<?php

namespace App\Http\Controllers\MainMenu;

use App\Http\Controllers\Controller;
use App\Services\MahasiswaService;
use App\Models\Prodi;
use App\Models\Dosen;
use App\Http\Requests\StoreMahasiswaRequest;
use App\Http\Requests\UpdateMahasiswaRequest;
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
                    'id'       => $d->id,
                    'nama'     => $d->user->name ?? 'Unknown',
                    'nidn'     => $d->nidn,
                    'prodi_id' => $d->prodi_id,
                ];
            }),
            'angkatan_list' => $this->mahasiswaService->getAngkatanList(),
        ]);
    }

    public function store(StoreMahasiswaRequest $request): RedirectResponse
    {
        $this->mahasiswaService->createMahasiswa($request->validated());

        return redirect()->back()->with('success', 'Mahasiswa berhasil ditambahkan.');
    }

    public function update(UpdateMahasiswaRequest $request, string $id): RedirectResponse
    {
        $this->mahasiswaService->updateMahasiswa($id, $request->validated());

        return redirect()->back()->with('success', 'Data mahasiswa berhasil diperbarui.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->mahasiswaService->deleteMahasiswa($id);

        return redirect()->back()->with('success', 'Mahasiswa berhasil dihapus.');
    }

    /**
     * Securely show student document (KTP / KK).
     */
    public function showDocument(\App\Models\Mahasiswa $mahasiswa, string $collection)
    {
        if (!in_array($collection, ['ktp', 'kk'])) {
            abort(404);
        }

        $user = auth()->user();
        if (!$user) {
            abort(401);
        }

        // Allow only admins or the student themselves to access
        if (!$user->hasRole('admin') && $mahasiswa->user_id !== $user->id) {
            abort(403, 'Unauthorized access to student documents.');
        }

        $media = $mahasiswa->getFirstMedia($collection);
        if (!$media) {
            abort(404, 'Document not found.');
        }

        if (request()->has('download')) {
            return response()->download($media->getPath(), $media->file_name);
        }

        return response()->file($media->getPath());
    }
}
