<?php

namespace App\Http\Controllers\Api;

use GuzzleHttp\Client;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MovieApiController extends Controller
{
    private $client;
    private $apiKey;

    public function __construct()
    {
        $this->apiKey = env('TMDB_KEY');
        $this->client = new Client([
            'base_uri' => 'https://api.themoviedb.org/3/',
        ]);
    }

    public function index(Request $request)
    {
        $page = $request->query('page', 1);

        $response = $this->client->request('GET', 'movie/popular', [
            'query' => [
                'api_key' => $this->apiKey,
                'language' => 'pt-BR',
                'page' => $page,
            ]
        ]);

        return response()->json(json_decode($response->getBody(), true));
    }

    public function discover(Request $request)
    {
        try {
            $page = $request->query('page', 1);
            $withGenres = $request->query('with_genres');

            $response = $this->client->request('GET', 'discover/movie', [
                'query' => [
                    'api_key' => $this->apiKey,
                    'language' => 'pt-BR',
                    'page' => $page,
                    'with_genres' => $withGenres,
                    'sort_by' => 'popularity.desc',
                    'include_adult' => false,
                    'include_video' => false,
                ]
            ]);

            return response()->json(json_decode($response->getBody(), true));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao buscar filmes por categoria'], 500);
        }
    }

    public function show($id)
    {
        try {
            $response = $this->client->request('GET', "movie/{$id}", [
                'query' => [
                    'api_key' => $this->apiKey,
                    'language' => 'pt-BR',
                ]
            ]);

            return response()->json(json_decode($response->getBody(), true));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Filme não encontrado'], 404);
        }
    }

    public function getMovieDetails($id)
    {
        try {
            $response = $this->client->request('GET', "movie/{$id}", [
                'query' => [
                    'api_key' => $this->apiKey,
                    'language' => 'pt-BR',
                    'append_to_response' => 'videos,credits,similar'
                ]
            ]);

            return response()->json(json_decode($response->getBody(), true));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Filme não encontrado'], 404);
        }
    }
}
