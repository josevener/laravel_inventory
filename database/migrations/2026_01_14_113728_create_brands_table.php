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
        Schema::create('brands', function (Blueprint $table) {
            $table->id();

            /**
             * MULTI-TENANCY
             */
            $table->foreignId('client_id')
                ->constrained('clients')
                ->cascadeOnDelete();

            /**
             * CORE BRAND FIELDS
             */
            $table->string('code', 50)->nullable();
            $table->string('name', 150);
            $table->text('description')->nullable();

            /**
             * OPTIONAL BRAND IDENTITY
             */
            $table->string('logo_path')->nullable();
            $table->string('website')->nullable();

            /**
             * STATUS & CONTROL
             */
            $table->boolean('is_active')->default(true);
            $table->boolean('is_system')->default(false);

            /**
             * AUDIT
             */
            $table->timestamps();
            $table->softDeletes();

            /**
             * CONSTRAINTS
             */
            $table->unique(['client_id', 'code']);
            $table->unique(['client_id', 'name']);

            /**
             * INDEXES
             */
            $table->index(['client_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('brands');
    }
};
