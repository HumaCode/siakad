<?php

namespace App\Http\Controllers\MainMenu;

use App\Http\Controllers\Controller;
use App\Models\Prodi;
use App\Models\Dosen;
use App\Models\Ruangan;
use App\Models\Fakultas;
use App\Services\ProdiService;
use App\Services\MataKuliahService;
use App\Http\Requests\StoreProdiRequest;
use App\Http\Requests\UpdateProdiRequest;
use App\Http\Requests\StoreMataKuliahRequest;
use App\Http\Requests\UpdateMataKuliahRequest;
use App\Http\Resources\ProdiResource;
use App\Http\Resources\MataKuliahResource;
use App\Models\MataKuliah;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AkademikController extends Controller
{
    protected ProdiService $prodiService;
    protected MataKuliahService $mataKuliahService;

    /**
     * AkademikController constructor.
     */
    public function __construct(ProdiService $prodiService, MataKuliahService $mataKuliahService)
    {
        $this->prodiService = $prodiService;
        $this->mataKuliahService = $mataKuliahService;
    }

    public function index(\Illuminate\Http\Request $request): Response
    {
        $search = $request->query('search');
        $fakultasFilter = $request->query('fakultas');
        $tahunFilter = $request->query('tahun');

        // Mata Kuliah filters
        $searchMk = $request->query('search_mk');
        $prodiMk = $request->query('prodi_mk');
        $semMk = $request->query('sem_mk');
        $jenisMk = $request->query('jenis_mk');

        $paginatedProdis = $this->prodiService->getPaginatedProdis($search, $fakultasFilter, $tahunFilter, 6);
        $paginatedMataKuliahs = $this->mataKuliahService->getPaginatedMataKuliahs($searchMk, $prodiMk, $semMk, $jenisMk, 10);

        $stats = [
            'prodi_count' => Prodi::count(),
            'dosen_count' => Dosen::count(),
            'ruangan_count' => Ruangan::count(),
            'matakuliah_count' => MataKuliah::count(),
        ];

        $fakultas = Fakultas::orderBy('nama')->get(['id', 'nama', 'kode']);
        
        $prodisResource = $paginatedProdis->through(function ($prodi) {
            return (new ProdiResource($prodi))->resolve();
        });

        $mataKuliahsResource = $paginatedMataKuliahs->through(function ($mk) {
            return (new MataKuliahResource($mk))->resolve();
        });

        $dosens = Dosen::orderBy('nama')->get()->map(function ($d) {
            return [
                'id' => $d->id,
                'nama' => $d->nama_lengkap,
                'nidn' => $d->nidn,
            ];
        });

        return Inertia::render('MainMenu/Akademik/Akademik', [
            'stats' => $stats,
            'fakultas' => $fakultas,
            'prodis' => $prodisResource,
            'mata_kuliahs' => $mataKuliahsResource,
            'all_prodis' => Prodi::orderBy('nama')->get(['id', 'nama']),
            'all_dosens' => $dosens,
            'filters' => [
                'search' => $search,
                'fakultas' => $fakultasFilter,
                'tahun' => $tahunFilter,
                'search_mk' => $searchMk,
                'prodi_mk' => $prodiMk,
                'sem_mk' => $semMk,
                'jenis_mk' => $jenisMk,
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

    /**
     * Store a new course.
     */
    public function storeMataKuliah(StoreMataKuliahRequest $request): RedirectResponse
    {
        $this->mataKuliahService->storeMataKuliah($request->validated());

        return redirect()->back()->with('success', 'Mata Kuliah baru berhasil disimpan.');
    }

    /**
     * Update an existing course.
     */
    public function updateMataKuliah(UpdateMataKuliahRequest $request, MataKuliah $matakuliah): RedirectResponse
    {
        $this->mataKuliahService->updateMataKuliah($matakuliah, $request->validated());

        return redirect()->back()->with('success', 'Mata Kuliah berhasil diperbarui.');
    }

    /**
     * Delete an existing course.
     */
    public function destroyMataKuliah(MataKuliah $matakuliah): RedirectResponse
    {
        $this->mataKuliahService->deleteMataKuliah($matakuliah);

        return redirect()->back()->with('success', 'Mata Kuliah berhasil dihapus.');
    }
}
