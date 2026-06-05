# 🔐 Akun Pengguna & Kredensial Default - SIAKAD

File ini mencantumkan semua akun default hasil *seeding* database untuk keperluan pengujian dan pengembangan aplikasi SIAKAD. 

> [!WARNING]
> Kredensial di bawah ini hanya digunakan untuk lingkungan **pengembangan (development)**. Jangan gunakan password default ini atau file ini di server **produksi (production)**.

---

## 👥 Daftar Akun Default

Semua akun di bawah ini menggunakan password default: **`password`**

| Nama | Email | Role | Detail Tambahan | Deskripsi Akses |
| :--- | :--- | :--- | :--- | :--- |
| **Super Administrator** | `superadmin@siakad.com` | `super_admin` | - | Akses penuh ke seluruh modul sistem. |
| **Admin SIAKAD** | `admin@siakad.com` | `admin` | - | Pengelola civitas akademik, user, & prodi. |
| **Budi Setiawan** | `akademik@siakad.com` | `akademik` | Staf Akademik | Pengelola jadwal, kurikulum, matakuliah, & KRS. |
| **Siti Rahma** | `keuangan@siakad.com` | `keuangan` | Staf Keuangan | Pengelola tagihan & verifikasi pembayaran. |
| **Hendra Wijaya, S.T., M.T.** | `hendra.dosen@siakad.com` | `dosen` | NIDN: `0412038901` (Prodi: Informatika) | Input nilai, presensi, & persetujuan KRS. |
| **Dr. Lutfi Hakim, S.Kom., M.T.I.** | `lutfi.dosen@siakad.com` | `dosen` | NIDN: `0420078202` (Prodi: Sistem Informasi) | Input nilai, presensi, & persetujuan KRS. |
| **Aditya Pratama** | `aditya.mhs@siakad.com` | `mahasiswa` | NIM: `251011526101` (Prodi: Informatika) | Pengisian KRS, melihat jadwal, presensi, & nilai. |
| **Nabila Putri** | `nabila.mhs@siakad.com` | `mahasiswa` | NIM: `251011526202` (Prodi: Sistem Informasi) | Pengisian KRS, melihat jadwal, presensi, & nilai. |

---

## 🛠️ Perintah Terkait Database & Seeding

Jika Anda perlu mereset database ke kondisi awal (termasuk membuat ulang akun-akun di atas), Anda dapat menjalankan perintah-perintah berikut melalui terminal di folder projek:

### 1. Reset & Seed Ulang Seluruh Database
Perintah ini akan menghapus semua tabel dan menjalankan ulang semua migrasi beserta seeder-nya:
```bash
php artisan migrate:fresh --seed
```

### 2. Jalankan Seeder Tertentu Saja
Jika Anda hanya ingin menjalankan ulang seeder pengguna tanpa mereset tabel lain:
```bash
php artisan db:seed --class=UsersAndCivitasSeeder
```
