<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expense;

class ExpenseController extends Controller
{
    public function store(Request $request)
    {
        // Optional: Log to see if the request is hitting here
        \Log::info('Received expense:', $request->all());

        $validated = $request->validate([
            'type' => 'nullable|string',
            'value' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
        ]);

        $expense = Expense::create([
            'category' => $validated['value'],
            'amount' => $validated['amount'],
            'type' => $validated['type'] ?? 'text',
            'date' => $validated['date'],
        ]);

        return response()->json([
            'message' => 'Expense created!',
            'expense' => $expense
        ], 201);
    }

    public function index()
    {
        return Expense::orderBy('date', 'desc')->get();
    }
}
