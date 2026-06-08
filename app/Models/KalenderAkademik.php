<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class KalenderAkademik extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'tahun',
        'kategori',
        'jenis',
        'judul',
        'deskripsi',
        'tanggal_mulai',
        'tanggal_selesai',
        'warna',
        'ikon',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];
}
