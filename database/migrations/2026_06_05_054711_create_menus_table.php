<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('url');
            $table->string('category')->nullable();
            $table->string('icon')->nullable();
            $table->boolean('active')->default(1);
            $table->integer('orders')->default(0);
            $table->foreignId('main_menu_id')->nullable()->constrained('menus')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('menu_permission', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_id')->constrained('menus')->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained('permissions')->cascadeOnDelete();
            $table->unique(['menu_id', 'permission_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_permission');
        Schema::dropIfExists('menus');
    }
};
