<?php

namespace App\Http\Controllers\MainMenu;

use App\Http\Controllers\Controller;
use App\Models\Prodi;
use App\Models\Dosen;
use App\Models\Ruangan;
use App\Models\Fakultas;
use App\Services\ProdiService;
use App\Http\Requests\StoreProdiRequest;
use App\Http\Requests\UpdateProdiRequest;
use App\Http\Resources\ProdiResource;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AkademikController extends Controller
{
    protected ProdiService $prodiService;

    /**
     * AkademikController constructor.
     */
    public function __construct(ProdiService $prodiService)
    {
        $this->prodiService = $prodiService;
    }

    public function index(\Illuminate\Http\Request $request): Response
    {
        $search = $request->query('search');
        $fakultasFilter = $request->query('fakultas');
        $tahunFilter = $request->query('tahun');

        $paginatedProdis = $this->prodiService->getPaginatedProdis($search, $fakultasFilter, $tahunFilter, 6);

        $stats = [
            'prodi_count' => Prodi::count(),
            'dosen_count' => Dosen::count(),
            'ruangan_count' => Ruangan::count(),
        ];

        $fakultas = Fakultas::orderBy('nama')->get(['id', 'nama', 'kode']);
        
        $prodisResource = $paginatedProdis->through(function ($prodi) {
            return (new ProdiResource($prodi))->resolve();
        });

        return Inertia::render('MainMenu/Akademik/Akademik', [
            'stats' => $stats,
            'fakultas' => $fakultas,
            'prodis' => $prodisResource,
            'filters' => [
                'search' => $search,
                'fakultas' => $fakultasFilter,
                'tahun' => $tahunFilter,
            ],
        ]);
    }

    /**
     * Store a new program of study.
     */
    public function store(StoreProdiRequest $request): RedirectResponse
    {
        $this->prodiService->storeProdi($request->validated());

        return redirect()->back()->with('success', 'Program Studi baru berhasil disimpan.');
    }

    /**
     * Update an existing program of study.
     */
    public function update(UpdateProdiRequest $request, Prodi $prodi): RedirectResponse
    {
        $this->prodiService->updateProdi($prodi, $request->validated());

        return redirect()->back()->with('success', 'Program Studi berhasil diperbarui.');
    }

    /**
     * Delete an existing program of study.
     */
    public function destroy(Prodi $prodi): RedirectResponse
    {
        $this->prodiService->deleteProdi($prodi);

        return redirect()->back()->with('success', 'Program Studi berhasil dihapus.');
    }
}
