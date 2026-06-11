<?php

namespace App\Http\Controllers\MainMenu;

use App\Http\Controllers\Controller;
use App\Services\DosenService;
use App\Models\Prodi;
use App\Models\Dosen;
use App\Models\User;
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

        // Fetch users who are staff members (roles other than 'dosen' and 'mahasiswa')
        $roleNames = ['super_admin', 'dev', 'admin', 'akademik', 'keuangan'];
        $existingRoles = \Spatie\Permission\Models\Role::whereIn('name', $roleNames)->pluck('name')->toArray();
        $stafUsers = !empty($existingRoles) ? User::role($existingRoles)->get() : collect();
        $stafList = $stafUsers->map(function ($user) {
            $initials = collect(explode(' ', $user->name))
                ->map(fn($n) => mb_substr($n, 0, 1))
                ->take(2)
                ->join('');
            
            // Map role to divisi & jabatan
            $divisi = 'IT & Infrastruktur';
            $jabatan = 'Staf IT';
            
            if ($user->hasRole('keuangan')) {
                $divisi = 'Keuangan';
                $jabatan = 'Staf Keuangan';
            } elseif ($user->hasRole('akademik')) {
                $divisi = 'Akademik & Registrar';
                $jabatan = 'Staf Akademik';
            } elseif ($user->hasRole('admin')) {
                $divisi = 'IT & Infrastruktur';
                $jabatan = 'Admin Sistem';
            } elseif ($user->hasRole('super_admin')) {
                $divisi = 'IT & Infrastruktur';
                $jabatan = 'Super Administrator';
            } elseif ($user->hasRole('dev')) {
                $divisi = 'IT & Infrastruktur';
                $jabatan = 'Developer';
            }
            
            $nip = '199' . (abs(crc32($user->email)) % 9) . '01202022100' . (abs(crc32($user->id)) % 90 + 10);
            $masaKerja = ((abs(crc32($user->email)) % 8) + 1) . ' tahun';
            $firstRole = $user->roles->first()?->name ?: 'admin';

            return [
                'id'       => $user->id,
                'nip'      => $nip,
                'nama'     => $user->name,
                'initials' => $initials ?: 'ST',
                'divisi'   => $divisi,
                'jabatan'  => $jabatan,
                'masaKerja'=> $masaKerja,
                'status'   => 'Aktif',
                'email'    => $user->email,
                'role'     => $firstRole,
                'foto_url' => $user->foto_url,
            ];
        });

        return Inertia::render('MainMenu/Dosen/Dosen', [
            'dosens'     => $dosens,
            'stats'      => $stats,
            'all_prodis' => Prodi::orderBy('nama')->pluck('nama')->toArray(),
            'stafList'   => $stafList,
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
            }
        }
    }

    public function storeStaf(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama'                  => 'required|string|max:255',
            'email'                 => 'required|string|email|max:255|unique:users',
            'role'                  => 'required|string|in:super_admin,dev,admin,akademik,keuangan',
            'password'              => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
            'foto'                  => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        $user = User::create([
            'name'     => $validated['nama'],
            'email'    => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        $user->assignRole($validated['role']);
        $this->handleStafPhotoUpload($user, $request);

        return redirect()->back()->with('success', 'Data staf non-dosen berhasil ditambahkan.');
    }

    public function updateStaf(Request $request, string $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'nama'                  => 'required|string|max:255',
            'email'                 => 'required|string|email|max:255|unique:users,email,' . $id,
            'role'                  => 'required|string|in:super_admin,dev,admin,akademik,keuangan',
            'password'              => 'nullable|string|min:8|confirmed',
            'password_confirmation' => 'nullable|string',
            'foto'                  => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        $userData = [
            'name'  => $validated['nama'],
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $userData['password'] = bcrypt($validated['password']);
        }

        $user->update($userData);
        $user->syncRoles([$validated['role']]);
        $this->handleStafPhotoUpload($user, $request);

        return redirect()->back()->with('success', 'Data staf non-dosen berhasil diperbarui.');
    }

    public function destroyStaf(string $id): RedirectResponse
    {
        $user = User::findOrFail($id);
        $user->clearMediaCollection('foto');
        $user->delete();

        return redirect()->back()->with('success', 'Data staf non-dosen berhasil dihapus.');
    }

    /**
     * Handle staf photo upload with WebP conversion (reuses same GD logic as Dosen).
     */
    private function handleStafPhotoUpload(User $user, Request $request): void
    {
        if (!$request->hasFile('foto')) {
            return;
        }

        $file     = $request->file('foto');
        $mimeType = $file->getMimeType();
        $image    = null;

        if ($mimeType === 'image/jpeg' || $mimeType === 'image/jpg') {
            $image = @imagecreatefromjpeg($file->getPathname());
        } elseif ($mimeType === 'image/png') {
            $image = @imagecreatefrompng($file->getPathname());
        } elseif ($mimeType === 'image/webp') {
            $image = @imagecreatefromwebp($file->getPathname());
        }

        if ($image) {
            $tempPath = tempnam(sys_get_temp_dir(), 'staf_foto') . '.webp';

            if (@imagewebp($image, $tempPath, 80)) {
                imagedestroy($image);

                $safeSlug = preg_replace('/[^a-zA-Z0-9_-]/', '_', mb_strtolower($user->name));

                $user->addMedia($tempPath)
                    ->usingFileName($safeSlug . '_' . $user->id . '.webp')
                    ->usingName($user->name)
                    ->toMediaCollection('foto');
            } else {
                imagedestroy($image);
                $user->addMediaFromRequest('foto')
                    ->toMediaCollection('foto');
            }

            if (file_exists($tempPath)) {
                @unlink($tempPath);
            }
        }
    }
}
