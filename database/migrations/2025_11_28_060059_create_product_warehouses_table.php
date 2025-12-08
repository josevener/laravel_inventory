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
        Schema::create('product_warehouse', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('warehouse_id')->constrained('warehouses')->onDelete('cascade');
            $table->integer('current_stock')->default(0);
            $table->decimal('total_value', 14, 2)->default(0); // current_stock × cost_price
            $table->timestamps();

            $table->unique(['product_id', 'warehouse_id']);

            $table->index('client_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         // Disable foreign key checks to avoid constraint errors
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('product_warehouse');

        // Re-enable foreign key checks
        Schema::enableForeignKeyConstraints();
    }
};
