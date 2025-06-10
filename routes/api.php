<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MovieApiController; // <-- Importar fora do bloco de comentários

// Rotas públicas para filmes
Route::get('/movies', [MovieApiController::class, 'index']);
Route::get('/movies/discover', [MovieApiController::class, 'discover']);
Route::get('/movies/{id}', [MovieApiController::class, 'show']);

// Rotas protegidas que requerem autenticação
Route::middleware('check.access')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
