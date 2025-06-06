<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ExpenseController;

// Auth routes (public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Partially protected Expense routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/expenses', [ExpenseController::class, 'store']); // Text input like "Food - 300"
    Route::get('/expenses', [ExpenseController::class, 'index']);  // Get list of expenses
    Route::post('/expenses/screenshot', [ExpenseController::class, 'uploadScreenshot']);
    Route::post('/expenses/audio', [ExpenseController::class, 'uploadAudio']);
    Route::post('/expenses/video', [ExpenseController::class, 'uploadVideo']);
    Route::delete('/expenses/{id}', [ExpenseController::class, 'destroy']);
    Route::put('/expenses/{id}', [ExpenseController::class, 'update']);
});
