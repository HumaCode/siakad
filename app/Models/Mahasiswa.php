<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

#[Fillable([
    'user_id',
    'nim',
    'nama',
    'prodi_id',
    'angkatan',
    'status_akademik',
    'dosen_wali_id',
])]
class Mahasiswa extends Model implements HasMedia
{
    use HasFactory, HasUlids, SoftDeletes, InteractsWithMedia, LogsActivity;

    protected $table = 'mahasiswas';

    protected $appends = ['foto_url', 'ktp_url', 'kk_url'];

    /**
     * Get the photo URL from Spatie media library.
     */
    public function getFotoUrlAttribute(): ?string
    {
        $media = $this->getFirstMedia('foto');
        if (!$media) {
            return null;
        }
        return '/storage/' . $media->id . '/' . $media->file_name;
    }

    public function getKtpUrlAttribute(): ?string
    {
        $media = $this->getFirstMedia('ktp');
        if (!$media) {
            return null;
        }
        return route('mahasiswa.document', [$this->id, 'ktp'], false) . '?ext=' . strtolower(pathinfo($media->file_name, PATHINFO_EXTENSION));
    }

    /**
     * Get the Kartu Keluarga (KK) URL from Spatie media library.
     */
    public function getKkUrlAttribute(): ?string
    {
        $media = $this->getFirstMedia('kk');
        if (!$media) {
            return null;
        }
        return route('mahasiswa.document', [$this->id, 'kk'], false) . '?ext=' . strtolower(pathinfo($media->file_name, PATHINFO_EXTENSION));
    }

    /**
     * Configure activity logging.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty();
    }

    /**
     * Get the user account for this student.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the study program of the student.
     */
    public function prodi(): BelongsTo
    {
        return $this->belongsTo(Prodi::class);
    }

    /**
     * Get the academic advisor (dosen wali) for this student.
     */
    public function dosenWali(): BelongsTo
    {
        return $this->belongsTo(Dosen::class, 'dosen_wali_id');
    }
}
