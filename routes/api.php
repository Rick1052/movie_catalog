<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MovieApiController; // <-- Importar fora do bloco de comentários

// Rotas públicas para filmes
Route::get('/movies', [MovieApiController::class, 'index']);
Route::get('/movies/{id}', [MovieApiController::class, 'show']);

// Rota protegida para usuário autenticado
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
