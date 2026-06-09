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
        Schema::table('mahasiswas', function (Blueprint $table) {
            $table->string('nik')->nullable();
            $table->string('no_kk')->nullable();
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('jenis_kelamin')->nullable();
            $table->string('agama')->nullable();
            $table->string('kewarganegaraan')->nullable();
            $table->string('no_hp')->nullable();
            $table->text('alamat')->nullable();
            $table->integer('semester_saat_ini')->nullable();
            $table->string('fakultas')->nullable();
            $table->string('jalur_masuk')->nullable();
            $table->string('asal_sekolah')->nullable();
            $table->integer('tahun_lulus_sma')->nullable();
            $table->string('status_awal')->nullable();
            $table->string('ayah_nama')->nullable();
            $table->string('ayah_pekerjaan')->nullable();
            $table->string('ayah_penghasilan')->nullable();
            $table->string('ibu_nama')->nullable();
            $table->string('ibu_pekerjaan')->nullable();
            $table->string('ibu_no_hp')->nullable();
            $table->text('ortu_alamat')->nullable();
            $table->string('email_pribadi')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mahasiswas', function (Blueprint $table) {
            $table->dropColumn([
                'nik', 'no_kk', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin',
                'agama', 'kewarganegaraan', 'no_hp', 'alamat', 'semester_saat_ini',
                'fakultas', 'jalur_masuk', 'asal_sekolah', 'tahun_lulus_sma', 'status_awal',
                'ayah_nama', 'ayah_pekerjaan', 'ayah_penghasilan', 'ibu_nama', 'ibu_pekerjaan',
                'ibu_no_hp', 'ortu_alamat', 'email_pribadi'
            ]);
        });
    }
};
