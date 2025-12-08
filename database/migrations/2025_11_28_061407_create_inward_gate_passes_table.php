<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inward_gate_passes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->string('gate_pass_no');
            $table->unique(['client_id', 'gate_pass_no']);
            $table->foreignId('project_id')->constrained();
            $table->string('vehicle_no');
            $table->string('driver_name')->nullable();
            $table->text('remarks')->nullable();
            $table->enum('status', ['pending', 'received', 'partial', 'completed'])->default('pending');
            $table->foreignId('received_by')->nullable()->constrained('users');
            $table->timestamp('received_at')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();

            // Indexes
            $table->index('client_id');
            $table->index('gate_pass_no');
            $table->index('driver_name');
            $table->index('vehicle_no');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inward_gate_passes');
    }
};
