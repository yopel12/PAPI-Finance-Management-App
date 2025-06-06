<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expense;

class ExpenseController extends Controller
{
    // Store new expense
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'date' => 'nullable|date',
        ]);

        $validated['user_id'] = 1; // Set default user for now

        $expense = Expense::create($validated);

        return response()->json([
            'message' => 'Expense created!',
            'expense' => $expense
        ], 201);
    }

    // List all expenses for user_id 1
    public function index(Request $request)
    {
        $expenses = Expense::where('user_id', 1)->latest()->get();

        return response()->json($expenses);
    }
}
