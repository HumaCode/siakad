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

    /**
     * Display the academic dashboard.
     */
    public function index(): Response
    {
        $prodis = $this->prodiService->getAllProdis();

        $stats = [
            'prodi_count' => $prodis->count(),
            'dosen_count' => Dosen::count(),
            'ruangan_count' => Ruangan::count(),
        ];

        $fakultas = Fakultas::orderBy('nama')->get(['id', 'nama', 'kode']);
        $prodisResource = ProdiResource::collection($prodis)->resolve();

        return Inertia::render('MainMenu/Akademik/Akademik', [
            'stats' => $stats,
            'fakultas' => $fakultas,
            'prodis' => $prodisResource,
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
}
