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

        if (is_null($tahunFilter) || $tahunFilter === '') {
            $tahunFilter = (string) date('Y');
        }

        // Mata Kuliah filters
        $searchMk = $request->query('search_mk');
        $prodiMk = $request->query('prodi_mk');
        $semMk = $request->query('sem_mk');
        $jenisMk = $request->query('jenis_mk');

        $paginatedProdis = $this->prodiService->getPaginatedProdis($search, $fakultasFilter, $tahunFilter, 6);
        $paginatedMataKuliahs = $this->mataKuliahService->getPaginatedMataKuliahs($searchMk, $prodiMk, $semMk, $jenisMk, $tahunFilter, 10);

        $stats = [
            'prodi_count' => Prodi::count(),
            'dosen_count' => Dosen::count(),
            'ruangan_count' => Ruangan::count(),
            'matakuliah_count' => MataKuliah::count(),
            'jadwal_count' => \App\Models\JadwalKuliah::count(),
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

        $jadwals = \App\Models\JadwalKuliah::with(['mataKuliah', 'ruangan', 'dosen', 'prodi'])
            ->whereHas('prodi', function($q) use ($tahunFilter) {
                $q->where('tahun', $tahunFilter);
            })->get();
            
        $ruangans = \App\Models\Ruangan::orderBy('nama_ruangan')->get()->map(function ($r) {
            return [
                'id' => $r->id,
                'nama' => $r->nama_ruangan,
                'gedung' => $r->nama_gedung,
                'kapasitas' => $r->kapasitas,
            ];
        });
        
        $allMataKuliahs = \App\Models\MataKuliah::whereHas('prodi', function($q) use ($tahunFilter) {
            $q->where('tahun', $tahunFilter);
        })->orderBy('nama')->get()->map(function ($mk) {
            return [
                'id' => $mk->id,
                'kode' => $mk->kode,
                'nama' => $mk->nama,
                'dosen_id' => $mk->dosen_id,
                'prodi_id' => $mk->prodi_id,
                'sks_teori' => $mk->sks_teori,
                'sks_praktik' => $mk->sks_praktik,
            ];
        });
        
        $allKelas = \App\Models\Kelas::whereHas('prodi', function($q) use ($tahunFilter) {
            $q->where('tahun', $tahunFilter);
        })->orderBy('nama')->get()->map(function ($k) {
            return [
                'id' => $k->id,
                'nama' => $k->nama,
                'prodi_id' => $k->prodi_id,
                'status' => $k->status,
            ];
        });

        return Inertia::render('MainMenu/Akademik/Akademik', [
            'stats' => $stats,
            'fakultas' => $fakultas,
            'prodis' => $prodisResource,
            'mata_kuliahs' => $mataKuliahsResource,
            'all_prodis' => Prodi::where('tahun', $tahunFilter)->orderBy('nama')->get(['id', 'nama']),
            'all_prodis_with_years' => Prodi::with('fakultas')->orderBy('nama')->get()->map(function ($p) {
                return [
                    'id' => $p->id,
                    'kode' => $p->kode,
                    'nama' => $p->nama,
                    'jenjang' => $p->jenjang,
                    'tahun' => $p->tahun,
                    'fakultas' => $p->fakultas ? $p->fakultas->nama : '',
                    'sks' => $p->sks,
                    'mkCount' => \App\Models\MataKuliah::where('prodi_id', $p->id)->count(),
                ];
            }),
            'all_dosens' => $dosens,
            'all_ruangans' => $ruangans,
            'all_mata_kuliahs_raw' => $allMataKuliahs,
            'all_kelas' => $allKelas,
            'jadwals' => \App\Http\Resources\JadwalResource::collection($jadwals)->resolve(),
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

    /**
     * Store a new class schedule.
     */
    public function storeJadwal(\App\Http\Requests\StoreJadwalRequest $request): RedirectResponse
    {
        $mk = \App\Models\MataKuliah::findOrFail($request->mata_kuliah_id);

        \App\Models\JadwalKuliah::create(array_merge($request->validated(), [
            'prodi_id' => $mk->prodi_id,
            'dosen_id' => $mk->dosen_id,
        ]));

        return redirect()->back()->with('success', 'Jadwal kuliah baru berhasil disimpan.');
    }

    /**
     * Update an existing class schedule.
     */
    public function updateJadwal(\App\Http\Requests\UpdateJadwalRequest $request, \App\Models\JadwalKuliah $jadwal): RedirectResponse
    {
        $mk = \App\Models\MataKuliah::findOrFail($request->mata_kuliah_id);

        $jadwal->update(array_merge($request->validated(), [
            'prodi_id' => $mk->prodi_id,
            'dosen_id' => $mk->dosen_id,
        ]));

        return redirect()->back()->with('success', 'Jadwal kuliah berhasil diperbarui.');
    }

    /**
     * Delete an existing class schedule.
     */
    public function destroyJadwal(\App\Models\JadwalKuliah $jadwal): RedirectResponse
    {
        $jadwal->delete();

        return redirect()->back()->with('success', 'Jadwal kuliah berhasil dihapus.');
    }

    /**
     * Store a new class.
     */
    public function storeKelas(\App\Http\Requests\StoreKelasRequest $request): RedirectResponse
    {
        \App\Models\Kelas::create($request->validated());

        return redirect()->back()->with('success', 'Kelas baru berhasil disimpan.');
    }

    /**
     * Update an existing class.
     */
    public function updateKelas(\App\Http\Requests\UpdateKelasRequest $request, \App\Models\Kelas $kelas): RedirectResponse
    {
        $kelas->update($request->validated());

        return redirect()->back()->with('success', 'Kelas berhasil diperbarui.');
    }

    /**
     * Delete an existing class.
     */
    public function destroyKelas(\App\Models\Kelas $kelas): RedirectResponse
    {
        $kelas->delete();

        return redirect()->back()->with('success', 'Kelas berhasil dihapus.');
    }

    /**
     * Copy program of study (and its courses/classes) from a previous year.
     */
    public function copyProdi(\Illuminate\Http\Request $request): RedirectResponse
    {
        $request->validate([
            'source_tahun' => ['required', 'integer'],
            'target_tahun' => ['required', 'integer'],
            'prodi_ids' => ['required', 'array'],
            'prodi_ids.*' => ['required', 'string', 'exists:prodis,id'],
        ]);

        $sourceTahun = $request->input('source_tahun');
        $targetTahun = $request->input('target_tahun');
        $prodiIds = $request->input('prodi_ids');

        \Illuminate\Support\Facades\DB::transaction(function () use ($prodiIds, $targetTahun) {
            $prodis = Prodi::whereIn('id', $prodiIds)->get();

            foreach ($prodis as $prodi) {
                // Check if a Prodi with the same code already exists in the target year
                $exists = Prodi::where('kode', $prodi->kode)
                    ->where('tahun', $targetTahun)
                    ->exists();

                if ($exists) {
                    continue; // Skip if already exists in target year
                }

                // Copy the Prodi record
                $newProdi = $prodi->replicate();
                $newProdi->tahun = $targetTahun;
                $newProdi->id = (string) \Illuminate\Support\Str::ulid();
                $newProdi->save();

                // Copy associated Mata Kuliahs
                $mataKuliahs = \App\Models\MataKuliah::where('prodi_id', $prodi->id)->get();
                foreach ($mataKuliahs as $mk) {
                    $newMk = $mk->replicate();
                    $newMk->prodi_id = $newProdi->id;
                    $newMk->id = (string) \Illuminate\Support\Str::ulid();
                    $newMk->save();
                }

                // Copy associated Kelas
                $kelas = \App\Models\Kelas::where('prodi_id', $prodi->id)->get();
                foreach ($kelas as $k) {
                    $newK = $k->replicate();
                    $newK->prodi_id = $newProdi->id;
                    $newK->id = (string) \Illuminate\Support\Str::ulid();
                    $newK->save();
                }
            }
        });

        return redirect()->back()->with('success', 'Kurikulum berhasil disalin ke tahun ' . $targetTahun . '.');
    }
}
