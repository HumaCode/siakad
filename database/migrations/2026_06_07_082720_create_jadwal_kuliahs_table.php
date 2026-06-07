<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jadwal_kuliahs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('mata_kuliah_id')->constrained('mata_kuliahs')->cascadeOnDelete();
            $table->foreignUlid('ruangan_id')->constrained('ruangans')->cascadeOnDelete();
            $table->foreignUlid('dosen_id')->constrained('dosens')->cascadeOnDelete();
            $table->foreignUlid('prodi_id')->constrained('prodis')->cascadeOnDelete();
            $table->string('hari'); // 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'
            $table->foreignUlid('kelas_id')->constrained('kelas')->cascadeOnDelete();
            $table->string('jam_mulai', 5); // '07:00'
            $table->string('jam_selesai', 5); // '08:40'
            $table->enum('tipe', ['Teori', 'Praktikum', 'Studio'])->default('Teori');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_kuliahs');
    }
};
