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
        Schema::table('clients', function (Blueprint $table) {
            $table->boolean('is_brand_enable')->default(false)->after('is_enable_warehouses');
            $table->boolean('is_pos_enable')->default(false)->after('is_brand_enable');
            $table->boolean('is_others_enable')->default(false)->after('is_pos_enable');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn('is_brand_enable');
            $table->dropColumn('is_pos_enable');
        });
    }
};