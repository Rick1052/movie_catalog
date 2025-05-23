<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MovieApiController extends Controller
{
    public function index(Request $request)
    {
        $page = $request->query('page', 1);
        $apiKey = env('TMDB_KEY');

        $response = Http::get("https://api.themoviedb.org/3/movie/popular", [
            'api_key' => $apiKey,
            'language' => 'pt-BR',
            'page' => $page,
        ]);

        return response()->json($response->json());
    }


}
