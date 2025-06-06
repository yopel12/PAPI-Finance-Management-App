<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ExpenseController extends Controller
{
    // Get all expenses for authenticated user
    public function index(Request $request)
    {
        return response()->json($request->user()->expenses, 200);
    }

    // Manual text input (e.g., "Food - 300")
    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required|string',
            'amount' => 'required|numeric',
        ]);

        $expense = Expense::create([
            'title' => $request->category,
            'amount' => $request->amount,
        ]);


        return response()->json($expense, 201);
    }



    // Upload screenshot + optional text like "Food - 150"
    public function uploadScreenshot(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'text' => 'nullable|string'
        ]);

        $path = $request->file('image')->store('screenshots', 'public');

        $category = null;
        $amount = null;

        if ($request->filled('text') && preg_match('/^\s*(\w+)\s*[-–]\s*(\d+(\.\d{1,2})?)\s*$/', $request->text, $matches)) {
            $category = ucfirst(strtolower($matches[1]));
            $amount = floatval($matches[2]);
        }

        $expense = $request->user()->expenses()->create([
            'category' => $category,
            'amount' => $amount,
            'image' => $path,
        ]);

        return response()->json($expense, 201);
    }

    // Upload audio + optional text
    public function uploadAudio(Request $request)
    {
        $request->validate([
            'audio' => 'required|mimes:mp3,wav,m4a|max:10240',
            'text' => 'nullable|string'
        ]);

        $path = $request->file('audio')->store('audio', 'public');

        $category = null;
        $amount = null;

        if ($request->filled('text') && preg_match('/^\s*(\w+)\s*[-–]\s*(\d+(\.\d{1,2})?)\s*$/', $request->text, $matches)) {
            $category = ucfirst(strtolower($matches[1]));
            $amount = floatval($matches[2]);
        }

        $expense = $request->user()->expenses()->create([
            'category' => $category,
            'amount' => $amount,
            'audio' => $path,
        ]);

        return response()->json($expense, 201);
    }

    // Upload video + optional text
    public function uploadVideo(Request $request)
    {
        $request->validate([
            'video' => 'required|mimes:mp4,mov,avi,wmv|max:20480',
            'text' => 'nullable|string',
        ]);

        $path = $request->file('video')->store('videos', 'public');

        $category = null;
        $amount = null;

        if ($request->filled('text') && preg_match('/^\s*(\w+)\s*[-–]\s*(\d+(\.\d{1,2})?)\s*$/', $request->text, $matches)) {
            $category = ucfirst(strtolower($matches[1]));
            $amount = floatval($matches[2]);
        }

        $expense = $request->user()->expenses()->create([
            'category' => $category,
            'amount' => $amount,
            'video' => $path,
        ]);

        return response()->json($expense, 201);
    }

    // Update expense
    public function update(Request $request, $id)
    {
        $expense = $request->user()->expenses()->find($id);
        if (!$expense) {
            return response()->json(['message' => 'Expense not found'], 404);
        }

        $validated = $request->validate([
            'category' => 'sometimes|required|string|max:255',
            'amount' => 'sometimes|required|numeric',
        ]);

        $expense->update($validated);

        return response()->json($expense);
    }

    // Delete expense
    public function destroy(Request $request, $id)
    {
        $expense = $request->user()->expenses()->find($id);
        if (!$expense) {
            return response()->json(['message' => 'Expense not found'], 404);
        }

        $expense->delete();
        return response()->json(['message' => 'Expense deleted']);
    }
}
