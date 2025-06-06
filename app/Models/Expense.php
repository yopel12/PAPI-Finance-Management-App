<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = ['category', 'amount', 'image', 'audio', 'video', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
