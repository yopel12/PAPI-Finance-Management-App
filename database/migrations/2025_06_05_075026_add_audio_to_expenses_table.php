<?php

use App\Models\Expense;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->string('audio')->nullable(); // path to audio file
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            //
        });
    }
    public function uploadAudio(Request $request)
    {
        $request->validate([
            'audio' => 'required|mimes:mp3,wav,m4a|max:10240', // max 10MB
            'text' => 'nullable|string' // fallback if no auto transcription yet
        ]);

        $path = $request->file('audio')->store('audio', 'public');

        $category = null;
        $amount = null;

        // Optional: if client already transcribed voice
        if ($request->filled('text') && preg_match('/^\s*(\w+)\s*[-–]\s*(\d+(\.\d{1,2})?)\s*$/', $request->text, $matches)) {
            $category = ucfirst(strtolower($matches[1]));
            $amount = floatval($matches[2]);
        }

        $expense = Expense::create([
            'category' => $category,
            'amount' => $amount,
            'audio' => $path,
        ]);

        return response()->json($expense, 201);
    }
};
