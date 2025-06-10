<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckAccessMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Verifica se o usuário está autenticado usando checkAccess
        if (!$request->session()->has('checkAccess')) {
            return redirect()->route('login')->with('error', 'Você precisa estar logado para acessar esta página.');
        }

        return $next($request);
    }
}