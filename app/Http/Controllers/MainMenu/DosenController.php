<?php

namespace App\Http\Controllers\MainMenu;

use App\Http\Controllers\Controller;
use App\Services\DosenService;
use App\Models\Prodi;
use App\Models\Dosen;
use App\Http\Requests\StoreDosenRequest;
use App\Http\Requests\UpdateDosenRequest;
use App\Http\Resources\DosenResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class DosenController extends Controller
{
    protected DosenService $dosenService;

    public function __construct(DosenService $dosenService)
    {
        $this->dosenService = $dosenService;
    }

    public function index(Request $request): Response
    {
        $dbDosens = $this->dosenService->getAllWithRelations();
        $dosens = DosenResource::collection($dbDosens)->resolve();

        if (empty($dosens)) {
            $dosens = null;
        }

        $stats = [
            'totalDosen'      => Dosen::count() ?: 482,
            'dosenAktif'      => Dosen::where('status_dosen', 'tetap')->count() ?: 461,
            'bergelarDoktor'  => Dosen::where('gelar_depan', 'like', '%Dr%')->orWhere('gelar_depan', 'like', '%Prof%')->count() ?: 128,
            'sesiMengajar'    => 892,
            'rating'          => 4.32,
            'publikasi'       => 1247,
        ];

        return Inertia::render('MainMenu/Dosen/Dosen', [
            'dosens'     => $dosens,
            'stats'      => $stats,
            'all_prodis' => Prodi::orderBy('nama')->pluck('nama')->toArray(),
        ]);
    }

    public function store(StoreDosenRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $prodi = Prodi::where('nama', $validated['prodi'])->first();
        if (!$prodi) {
            return redirect()->back()->withErrors(['prodi' => 'Program studi tidak ditemukan.']);
        }

        $dosenData = [
            'nidn' => $validated['nidn'],
            'nama' => $validated['nama'],
            'gelar_depan' => $validated['gelar_depan'] ?? null,
            'gelar_belakang' => $validated['gelar_belakang'] ?? null,
            'email' => $validated['email'],
            'prodi_id' => $prodi->id,
            'status_dosen' => $validated['status'] === 'Aktif' ? 'tetap' : 'luar_biasa',
            'jabatan' => $validated['jabatan'],
        ];

        $dosen = $this->dosenService->createDosen($dosenData);
        $this->handlePhotoUpload($dosen, $request);

        return redirect()->back()->with('success', 'Data dosen berhasil ditambahkan.');
    }

    public function update(UpdateDosenRequest $request, string $id): RedirectResponse
    {
        $validated = $request->validated();

        $prodi = Prodi::where('nama', $validated['prodi'])->first();
        if (!$prodi) {
            return redirect()->back()->withErrors(['prodi' => 'Program studi tidak ditemukan.']);
        }

        $dosenData = [
            'nidn' => $validated['nidn'],
            'nama' => $validated['nama'],
            'gelar_depan' => $validated['gelar_depan'] ?? null,
            'gelar_belakang' => $validated['gelar_belakang'] ?? null,
            'email' => $validated['email'],
            'prodi_id' => $prodi->id,
            'status_dosen' => $validated['status'] === 'Aktif' ? 'tetap' : 'luar_biasa',
            'jabatan' => $validated['jabatan'],
        ];

        $dosen = $this->dosenService->updateDosen($id, $dosenData);
        $this->handlePhotoUpload($dosen, $request);

        return redirect()->back()->with('success', 'Data dosen berhasil diperbarui.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->dosenService->deleteDosen($id);

        return redirect()->back()->with('success', 'Data dosen berhasil dihapus.');
    }

    /**
     * Handle photo upload with WebP conversion.
     */
    private function handlePhotoUpload(Dosen $dosen, Request $request): void
    {
        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $image = null;
            $mimeType = $file->getMimeType();
            
            if ($mimeType === 'image/jpeg' || $mimeType === 'image/jpg') {
                $image = @imagecreatefromjpeg($file->getPathname());
            } elseif ($mimeType === 'image/png') {
                $image = @imagecreatefrompng($file->getPathname());
            } elseif ($mimeType === 'image/webp') {
                $image = @imagecreatefromwebp($file->getPathname());
            }
            
            if ($image) {
                $tempPath = tempnam(sys_get_temp_dir(), 'dosen_foto') . '.webp';
                if (@imagewebp($image, $tempPath, 80)) {
                    imagedestroy($image);
                    
                    $dosen->addMedia($tempPath)
                        ->usingFileName($dosen->nidn . '.webp')
                        ->usingName($dosen->nama)
                        ->toMediaCollection('foto');
                } else {
                    imagedestroy($image);
                    $dosen->addMediaFromRequest('foto')
                        ->toMediaCollection('foto');
                }
                
                if (file_exists($tempPath)) {
                    @unlink($tempPath);
                }
            } else {
                $dosen->addMediaFromRequest('foto')
                    ->toMediaCollection('foto');
            }
        }
    }
}
