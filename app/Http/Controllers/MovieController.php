<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use App\Models\Comment;

class MovieController extends Controller
{
    public function show($id)
    {
        $response = Http::get("https://api.themoviedb.org/3/movie/{$id}", [
            'api_key' => env('TMDB_KEY'),
            'language' => 'pt-BR',
        ]);

        if ($response->failed()) {
            abort(404, 'Filme não encontrado');
        }

        $movie = $response->json();

        // Buscar comentários do filme com usuário carregado
        $comments = Comment::where('movie_id', $id)->with('user')->latest()->get();

        return Inertia::render('Movies/Show', [
            'movie' => $movie,
            'comments' => $comments,
        ]);
    }
}
