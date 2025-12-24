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
        Schema::create('gate_pass_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->restrictOnDelete();
            $table->foreignId('gate_pass_id')->constrained('gate_passes')->restrictOnDelete();
            $table->foreignId('product_id')->constrained('products');
            $table->integer('quantity');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Add indexes for faster queries
            $table->index('client_id');
            $table->index('gate_pass_id');
            $table->index('product_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gatepass_items');
    }
};
