<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('gate_passes', function (Blueprint $table) {
            $table->string('gate_pass_no')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('gate_passes', function (Blueprint $table) {
            $table->string('gate_pass_no')->nullable(false)->change();
        });
    }
};
