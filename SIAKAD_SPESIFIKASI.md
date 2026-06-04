# 📚 SIAKAD — Sistem Informasi Akademik Kampus
> Dokumen Spesifikasi Teknis & Arsitektur

---

## 🧱 Tech Stack

| Layer | Teknologi |
|---|---|
| Backend Framework | Laravel 13 |
| Frontend Framework | React (via Breeze) |
| Auth Scaffolding | Laravel Breeze + React |
| CSS Framework | Bootstrap 5 |
| Permission & Role | Spatie Laravel Permission |
| Media Management | Spatie Laravel Media Library |
| Activity Logging | Spatie Laravel Activitylog |
| Database | MySQL / PostgreSQL |
| API Style | Inertia.js (Breeze React) |

---

## 📦 Dependencies Utama

```bash
# Laravel Packages
composer require laravel/breeze
php artisan breeze:install react

composer require spatie/laravel-permission
composer require spatie/laravel-medialibrary
composer require spatie/laravel-activitylog

# Frontend
npm install bootstrap
npm install @popperjs/core
```

---

## 🏗️ Arsitektur Clean Code

Setiap fitur mengikuti pola:

```
Controller → Request → Service → Repository (via Interface) → Model
                                                   ↓
                                            Resource (API Response)
```

### Struktur Folder

```
app/
├── Http/
│   ├── Controllers/
│   │   └── {Module}/
│   │       └── {Feature}Controller.php
│   ├── Requests/
│   │   └── {Module}/
│   │       ├── Store{Feature}Request.php
│   │       └── Update{Feature}Request.php
│   └── Resources/
│       └── {Module}/
│           └── {Feature}Resource.php
│
├── Services/
│   └── {Module}/
│       └── {Feature}Service.php
│
├── Repositories/
│   ├── Interfaces/
│   │   └── {Feature}RepositoryInterface.php
│   └── {Feature}Repository.php
│
├── Models/
│   └── {Feature}.php
│
└── Providers/
    └── RepositoryServiceProvider.php
```

---

## 🔑 Roles & Permissions (Spatie)

### Roles

| Role | Deskripsi |
|---|---|
| `super_admin` | Akses penuh ke seluruh sistem |
| `admin` | Manajemen data akademik |
| `dosen` | Input nilai, lihat jadwal, absensi |
| `mahasiswa` | Akses KRS, nilai, jadwal, tagihan |
| `keuangan` | Manajemen tagihan & pembayaran |
| `akademik` | Kelola kurikulum, jadwal, kalender |

### Contoh Permission

```
# Mahasiswa
mahasiswa.krs.view
mahasiswa.krs.submit
mahasiswa.nilai.view
mahasiswa.tagihan.view

# Dosen
dosen.nilai.input
dosen.absensi.manage
dosen.jadwal.view

# Admin / Akademik
mahasiswa.manage
dosen.manage
kurikulum.manage
jadwal.manage

# Keuangan
tagihan.manage
pembayaran.manage
```

---

## 📋 Modul Sistem

### 1. Autentikasi & Manajemen User
- Login / Logout (Breeze)
- Manajemen User & Role (Spatie Permission)
- Profile & Avatar (Spatie Media Library)
- Activity Log (Spatie Activitylog)

### 2. Data Master
- Fakultas
- Program Studi
- Tahun Akademik
- Semester
- Ruangan / Gedung

### 3. Mahasiswa
- Data Mahasiswa (profil, foto, dokumen)
- Status Akademik (aktif, cuti, lulus, DO)
- Riwayat Pendidikan

### 4. Dosen
- Data Dosen (profil, foto, dokumen)
- Jabatan Fungsional
- Homebase Prodi

### 5. Kurikulum
- Mata Kuliah
- Struktur Kurikulum per Prodi
- SKS & Bobot Nilai

### 6. Jadwal Kuliah
- Jadwal per Semester
- Manajemen Ruangan
- Konflik Jadwal Detection

### 7. KRS (Kartu Rencana Studi)
- Pengajuan KRS Mahasiswa
- Approval Dosen Wali
- Batas SKS per Semester

### 8. Absensi
- Absensi Mahasiswa per Pertemuan
- Rekap Kehadiran
- Batas Minimal Kehadiran

### 9. Nilai
- Input Nilai Komponen (UTS, UAS, Tugas)
- Kalkulasi Nilai Akhir & Grade
- Transkrip Nilai
- IPK & IPS

### 10. Keuangan
- Tagihan SPP / UKT
- Pembayaran
- History Transaksi
- Generate Kuitansi (PDF)

### 11. Laporan
- Transkrip Akademik (PDF)
- KHS (Kartu Hasil Studi)
- Laporan Kehadiran
- Statistik Akademik

---

## 🧩 Contoh Implementasi Clean Code

### Interface
```php
// app/Repositories/Interfaces/MahasiswaRepositoryInterface.php

namespace App\Repositories\Interfaces;

interface MahasiswaRepositoryInterface
{
    public function getAll(array $filters = []);
    public function findById(int $id);
    public function findByNim(string $nim);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
}
```

### Repository
```php
// app/Repositories/MahasiswaRepository.php

namespace App\Repositories;

use App\Models\Mahasiswa;
use App\Repositories\Interfaces\MahasiswaRepositoryInterface;

class MahasiswaRepository implements MahasiswaRepositoryInterface
{
    public function __construct(protected Mahasiswa $model) {}

    public function getAll(array $filters = [])
    {
        return $this->model
            ->with(['prodi', 'user'])
            ->when($filters['prodi_id'] ?? null, fn($q, $v) => $q->where('prodi_id', $v))
            ->when($filters['search'] ?? null, fn($q, $v) => $q->where('nama', 'like', "%$v%"))
            ->latest()
            ->paginate(15);
    }

    public function findById(int $id)
    {
        return $this->model->with(['prodi', 'user', 'media'])->findOrFail($id);
    }

    public function findByNim(string $nim)
    {
        return $this->model->where('nim', $nim)->firstOrFail();
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data)
    {
        $mahasiswa = $this->findById($id);
        $mahasiswa->update($data);
        return $mahasiswa;
    }

    public function delete(int $id)
    {
        return $this->findById($id)->delete();
    }
}
```

### Service
```php
// app/Services/Mahasiswa/MahasiswaService.php

namespace App\Services\Mahasiswa;

use App\Repositories\Interfaces\MahasiswaRepositoryInterface;

class MahasiswaService
{
    public function __construct(
        protected MahasiswaRepositoryInterface $repository
    ) {}

    public function getAll(array $filters = [])
    {
        return $this->repository->getAll($filters);
    }

    public function store(array $data): void
    {
        $mahasiswa = $this->repository->create($data);

        if (isset($data['foto'])) {
            $mahasiswa->addMedia($data['foto'])
                ->toMediaCollection('foto_profil');
        }

        activity('mahasiswa')
            ->performedOn($mahasiswa)
            ->log('Mahasiswa baru ditambahkan: ' . $mahasiswa->nama);
    }

    public function update(int $id, array $data): void
    {
        $mahasiswa = $this->repository->update($id, $data);

        activity('mahasiswa')
            ->performedOn($mahasiswa)
            ->log('Data mahasiswa diperbarui: ' . $mahasiswa->nama);
    }

    public function destroy(int $id): void
    {
        $mahasiswa = $this->repository->findById($id);

        activity('mahasiswa')
            ->performedOn($mahasiswa)
            ->log('Mahasiswa dihapus: ' . $mahasiswa->nama);

        $this->repository->delete($id);
    }
}
```

### Request
```php
// app/Http/Requests/Mahasiswa/StoreMahasiswaRequest.php

namespace App\Http\Requests\Mahasiswa;

use Illuminate\Foundation\Http\FormRequest;

class StoreMahasiswaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('mahasiswa.manage');
    }

    public function rules(): array
    {
        return [
            'nim'        => ['required', 'string', 'unique:mahasiswas,nim'],
            'nama'       => ['required', 'string', 'max:255'],
            'email'      => ['required', 'email', 'unique:users,email'],
            'prodi_id'   => ['required', 'exists:prodis,id'],
            'angkatan'   => ['required', 'digits:4'],
            'foto'       => ['nullable', 'image', 'max:2048'],
        ];
    }
}
```

### Resource
```php
// app/Http/Resources/Mahasiswa/MahasiswaResource.php

namespace App\Http\Resources\Mahasiswa;

use Illuminate\Http\Resources\Json\JsonResource;

class MahasiswaResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'       => $this->id,
            'nim'      => $this->nim,
            'nama'     => $this->nama,
            'email'    => $this->user?->email,
            'prodi'    => $this->prodi?->nama,
            'angkatan' => $this->angkatan,
            'status'   => $this->status,
            'foto_url' => $this->getFirstMediaUrl('foto_profil'),
        ];
    }
}
```

### Controller
```php
// app/Http/Controllers/Mahasiswa/MahasiswaController.php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mahasiswa\StoreMahasiswaRequest;
use App\Http\Requests\Mahasiswa\UpdateMahasiswaRequest;
use App\Http\Resources\Mahasiswa\MahasiswaResource;
use App\Services\Mahasiswa\MahasiswaService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MahasiswaController extends Controller
{
    public function __construct(protected MahasiswaService $service) {}

    public function index(Request $request)
    {
        $mahasiswas = $this->service->getAll($request->only(['search', 'prodi_id']));

        return Inertia::render('Mahasiswa/Index', [
            'mahasiswas' => MahasiswaResource::collection($mahasiswas),
        ]);
    }

    public function store(StoreMahasiswaRequest $request)
    {
        $this->service->store($request->validated());

        return redirect()->route('mahasiswa.index')
            ->with('success', 'Mahasiswa berhasil ditambahkan.');
    }

    public function update(UpdateMahasiswaRequest $request, int $id)
    {
        $this->service->update($id, $request->validated());

        return redirect()->route('mahasiswa.index')
            ->with('success', 'Data mahasiswa berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $this->service->destroy($id);

        return redirect()->route('mahasiswa.index')
            ->with('success', 'Mahasiswa berhasil dihapus.');
    }
}
```

### Repository Service Provider
```php
// app/Providers/RepositoryServiceProvider.php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\MahasiswaRepositoryInterface;
use App\Repositories\MahasiswaRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(MahasiswaRepositoryInterface::class, MahasiswaRepository::class);
        // bind repository lainnya di sini...
    }
}
```

> Daftarkan di `bootstrap/providers.php`:
```php
return [
    App\Providers\AppServiceProvider::class,
    App\Providers\RepositoryServiceProvider::class,
];
```

---

## 🎨 Frontend (React + Bootstrap 5)

### Setup Bootstrap di React
```js
// resources/js/app.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
```

### Struktur Komponen React

```
resources/js/
├── Components/
│   ├── UI/
│   │   ├── Table.jsx
│   │   ├── Modal.jsx
│   │   ├── Pagination.jsx
│   │   ├── Badge.jsx
│   │   └── Alert.jsx
│   ├── Form/
│   │   ├── InputField.jsx
│   │   ├── SelectField.jsx
│   │   └── FileUpload.jsx
│   └── Layout/
│       ├── Sidebar.jsx
│       ├── Navbar.jsx
│       └── Breadcrumb.jsx
│
├── Layouts/
│   └── AppLayout.jsx
│
└── Pages/
    ├── Auth/
    ├── Dashboard/
    ├── Mahasiswa/
    │   ├── Index.jsx
    │   ├── Create.jsx
    │   └── Edit.jsx
    ├── Dosen/
    ├── Jadwal/
    ├── KRS/
    ├── Nilai/
    └── Keuangan/
```

---

## 🗄️ Konvensi Database

- Nama tabel: **snake_case plural** (`mahasiswas`, `mata_kuliahs`, `tahun_akademiks`)
- Primary key: `id` (auto increment)
- Timestamps: `created_at`, `updated_at` di semua tabel
- Soft delete: `deleted_at` untuk tabel kritis (mahasiswa, dosen, mata kuliah)
- Foreign key: `{tabel_singular}_id` (contoh: `prodi_id`, `dosen_id`)

---

## 🔒 Middleware & Gate

```php
// Contoh penggunaan middleware role di routes
Route::middleware(['auth', 'role:admin|akademik'])->group(function () {
    Route::resource('mahasiswa', MahasiswaController::class);
    Route::resource('dosen', DosenController::class);
});

Route::middleware(['auth', 'role:mahasiswa'])->group(function () {
    Route::get('krs', [KrsController::class, 'index']);
    Route::post('krs', [KrsController::class, 'store']);
});
```

---

## 📝 Catatan Development

- Gunakan **Laravel Pint** untuk code formatting: `./vendor/bin/pint`
- Gunakan **PHP Stan** untuk static analysis
- Setiap perubahan data penting **wajib** di-log menggunakan Spatie Activitylog
- Upload file (foto, dokumen) **wajib** via Spatie Media Library, bukan `Storage::put` manual
- Validasi **wajib** di FormRequest, bukan di Controller
- Business logic **wajib** di Service, bukan di Controller
- Query database **wajib** di Repository, bukan di Service/Controller langsung

---

*Dokumen ini dibuat sebagai panduan teknis pengembangan SIAKAD Kampus.*
*Last updated: Juni 2026*
