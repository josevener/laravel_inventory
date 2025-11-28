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
        Schema::create('inward_gate_pass_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inward_gate_pass_id')->constrained('inward_gate_passes')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products');
            $table->integer('quantity');
            $table->timestamps();

            // Add indexes for faster queries
            $table->index('inward_gate_pass_id');
            $table->index('product_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inward_gate_pass_items');
    }
};
