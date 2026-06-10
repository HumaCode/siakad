<?php

namespace App\Http\Controllers\MainMenu;

use App\Http\Controllers\Controller;
use App\Services\DosenService;
use App\Models\Prodi;
use App\Models\Dosen;
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
        $dbDosens = Dosen::with([
            'user',
            'prodi',
            'mahasiswaBimbingan.prodi',
            'mataKuliahs',
            'jadwalKuliahs.mataKuliah',
            'jadwalKuliahs.ruangan',
            'jadwalKuliahs.kelas',
        ])->get();

        $hariOrder = ['Senin' => 1, 'Selasa' => 2, 'Rabu' => 3, 'Kamis' => 4, 'Jumat' => 5, 'Sabtu' => 6];

        $dosens = $dbDosens->map(function ($d) use ($hariOrder) {
            $sks     = $d->mataKuliahs->sum('sks');
            $keahlian = $d->mataKuliahs->pluck('nama')->implode(', ') ?: '-';

            // Jadwal mengajar — sorted by hari
            $jadwal = $d->jadwalKuliahs
                ->sortBy(fn($j) => $hariOrder[$j->hari] ?? 9)
                ->values()
                ->map(fn($j) => [
                    'hari'       => $j->hari,
                    'jam_mulai'  => $j->jam_mulai,
                    'jam_selesai'=> $j->jam_selesai,
                    'mk'         => $j->mataKuliah?->nama ?? '-',
                    'sks_mk'     => $j->mataKuliah?->sks ?? 0,
                    'ruangan'    => $j->ruangan?->nama_ruangan ?? '-',
                    'kelas'      => $j->kelas?->nama ?? '-',
                    'tipe'       => $j->tipe ?? 'Teori',
                ])->values()->all();

            // Matakuliah diampu
            $mataKuliahs = $d->mataKuliahs->map(fn($mk) => [
                'kode'   => $mk->kode,
                'nama'   => $mk->nama,
                'sks'    => $mk->sks,
                'sem'    => $mk->sem,
                'jenis'  => $mk->jenis,
                'status' => $mk->status,
            ])->values()->all();

            // Mahasiswa bimbingan
            $mahasiswaBimbingan = $d->mahasiswaBimbingan->map(fn($m) => [
                'nim'     => $m->nim,
                'nama'    => $m->nama,
                'prodi'   => $m->prodi?->nama ?? '-',
                'angkatan'=> $m->angkatan,
                'status'  => $m->status_akademik,
            ])->values()->all();

            return [
                'id'                => $d->id,
                'nidn'              => $d->nidn,
                'nama'              => $d->nama,
                'nama_lengkap'      => $d->nama_lengkap,
                'gelar_depan'       => $d->gelar_depan,
                'gelar_belakang'    => $d->gelar_belakang,
                'prodi'             => $d->prodi?->nama ?? '-',
                'prodi_id'          => $d->prodi_id,
                'status_dosen'      => $d->status_dosen === 'tetap' ? 'Aktif' : 'Cuti',
                'email'             => $d->user?->email ?? '-',
                'hp'                => '-',
                'sks'               => $sks,
                'mhsBimbing'        => $d->mahasiswaBimbingan->count(),
                'rating'            => round(4.0 + (rand(0, 10) / 10), 1),
                'pub'               => rand(5, 50),
                'initials'          => collect(explode(' ', $d->nama))->map(fn($n) => mb_substr($n, 0, 1))->take(2)->implode(''),
                'ttl'               => '-',
                'pendidikan'        => $d->gelar_depan === 'Dr.' || $d->gelar_depan === 'Prof.' ? 'S3 – Doktor' : 'S2 – Magister',
                'keahlian'          => $keahlian,
                'jabatan'           => $d->jabatan ?? 'Tenaga Pengajar',
                'masaKerja'         => rand(3, 20) . ' tahun',
                'scopus'            => rand(10000, 99999),
                'jadwal'            => $jadwal,
                'mataKuliahs'       => $mataKuliahs,
                'mahasiswaBimbingan' => $mahasiswaBimbingan,
            ];
        });

        if ($dosens->isEmpty()) {
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

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nidn' => 'required|string|size:10|unique:dosens,nidn',
            'nama' => 'required|string|max:255',
            'gelar_depan' => 'nullable|string|max:20',
            'gelar_belakang' => 'nullable|string|max:50',
            'email' => 'required|email|unique:users,email',
            'prodi' => 'required|string',
            'jabatan' => 'required|string',
            'status' => 'required|string',
        ]);

        $prodi = Prodi::where('nama', $validated['prodi'])->first();
        if (!$prodi) {
            return redirect()->back()->withErrors(['prodi' => 'Program studi tidak ditemukan.']);
        }

        $dosenData = [
            'nidn' => $validated['nidn'],
            'nama' => $validated['nama'],
            'gelar_depan' => $validated['gelar_depan'],
            'gelar_belakang' => $validated['gelar_belakang'],
            'email' => $validated['email'],
            'prodi_id' => $prodi->id,
            'status_dosen' => $validated['status'] === 'Aktif' ? 'tetap' : 'luar_biasa',
            'jabatan' => $validated['jabatan'],
        ];

        $this->dosenService->createDosen($dosenData);

        return redirect()->back()->with('success', 'Data dosen berhasil ditambahkan.');
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $validated = $request->validate([
            'nidn' => 'required|string|size:10|unique:dosens,nidn,' . $id,
            'nama' => 'required|string|max:255',
            'gelar_depan' => 'nullable|string|max:20',
            'gelar_belakang' => 'nullable|string|max:50',
            'email' => 'required|email',
            'prodi' => 'required|string',
            'jabatan' => 'required|string',
            'status' => 'required|string',
        ]);

        $prodi = Prodi::where('nama', $validated['prodi'])->first();
        if (!$prodi) {
            return redirect()->back()->withErrors(['prodi' => 'Program studi tidak ditemukan.']);
        }

        $dosenData = [
            'nidn' => $validated['nidn'],
            'nama' => $validated['nama'],
            'gelar_depan' => $validated['gelar_depan'],
            'gelar_belakang' => $validated['gelar_belakang'],
            'email' => $validated['email'],
            'prodi_id' => $prodi->id,
            'status_dosen' => $validated['status'] === 'Aktif' ? 'tetap' : 'luar_biasa',
            'jabatan' => $validated['jabatan'],
        ];

        $this->dosenService->updateDosen($id, $dosenData);

        return redirect()->back()->with('success', 'Data dosen berhasil diperbarui.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->dosenService->deleteDosen($id);

        return redirect()->back()->with('success', 'Data dosen berhasil dihapus.');
    }
}
