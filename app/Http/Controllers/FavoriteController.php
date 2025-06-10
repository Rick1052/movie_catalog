<?php

namespace App\Http\Controllers;

use App\Models\FavoriteMovie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    // Somente usuários autenticados podem acessar essas rotas
    public function __construct()
    {
        $this->middleware('auth');
    }

    // No FavoriteController.php
    public function index()
    {
        // Busca os filmes favoritos do usuário autenticado
        $favorites = FavoriteMovie::with('Movie') 
            ->where('user_id', Auth::id())
            ->get();

        // Passa para a view via Inertia
        return inertia('Favorites/Index', [
            'favorites' => $favorites,
        ]);
    }



    public function store(Request $request)
    {
        if (FavoriteMovie::where('user_id', Auth::id())->where('movie_id', $request->movie_id)->exists()) {
            return redirect()->back()->with('info', 'Este filme já está nos seus favoritos.');
        }

        $request->validate([
            'movie_id' => 'required|integer',
            // 'content' => 'required|string|max:1000',
        ]);

        $favoriteMovie = FavoriteMovie::create([
            'user_id' => Auth::id(),
            'movie_id' => $request->movie_id,
            // 'content' => $request->content,
        ]);

        return redirect()->back()->with('success', 'Adicionado aos favoritos!');
    }

    public function destroy($movie_id)
    {
        $favorite = FavoriteMovie::where('user_id', Auth::id())->where('movie_id', $movie_id)->first();

        if (!$favorite) {
            return redirect()->back()->with('error', 'Favorito não encontrado.');
        }

        $favorite->delete();

        return redirect()->back()->with('success', 'Filme removido dos favoritos!');
    }

    public function check($movieId)
    {
        $isFavorite = FavoriteMovie::where('user_id', auth()->id())
            ->where('movie_id', $movieId)
            ->exists();

        return response()->json(['isFavorite' => $isFavorite]);
    }

}
