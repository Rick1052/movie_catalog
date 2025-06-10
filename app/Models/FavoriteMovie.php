<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FavoriteMovie extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'movie_id'];

    public function Movie()
    {
        return $this->belongsTo(Movie::class);
    }
}
