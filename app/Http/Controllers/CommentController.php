<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    // Somente usuários autenticados podem acessar essas rotas
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function store(Request $request)
    {
        $request->validate([
            'movie_id' => 'required|integer',
            'content' => 'required|string|max:1000',
        ]);

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'movie_id' => $request->movie_id,
            'content' => $request->content,
        ]);

        return redirect()->back()->with('success', 'Comentário criado!');
    }

    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment);

        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment->update([
            'content' => $request->content,
        ]);

        return back();
    }


    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment); // só pode deletar o próprio comentário

        $comment->delete();

        return redirect()->back()->with('success', 'Comentário removido!');
    }
}
