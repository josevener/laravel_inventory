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
        Schema::create('gate_passes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->restrictOnDelete();
            $table->foreignId('project_id')->constrained('projects')->restrictOnDelete();

            $table->string('gate_pass_no')->nullable();

            $table->unique(['client_id', 'created_date', 'gate_pass_no']);
            
            $table->unique(['created_at','gate_pass_no']);
            $table->string('authorized_bearer');
            $table->enum('type', ['dispatch', 'pullout']);
            $table->text('remarks')->nullable();
            $table->enum('status', ['pending', 'received', 'partial', 'completed'])->default('pending');
            $table->foreignId('received_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->timestamp('received_at')->nullable();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            // Date extracted from created_at for uniqueness rule
            $table->date('created_date')->storedAs('DATE(created_at)');

            // Indexes
            $table->index('client_id');
            $table->index(['client_id', 'project_id', 'authorized_bearer']);
            $table->index('gate_pass_no');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gate_passes');
    }
};
