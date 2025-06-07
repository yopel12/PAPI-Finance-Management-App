<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    // Get authenticated user profile
    public function show()
    {
        $user = Auth::user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'dob' => $user->dob,
            'gender' => $user->gender,
        ]);
    }

    // Update authenticated user profile
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'dob' => 'nullable|date',
            'gender' => 'nullable|string|max:10',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated',
            'user' => $user->only(['id', 'name', 'email', 'dob', 'gender']),
        ]);
    }
}
