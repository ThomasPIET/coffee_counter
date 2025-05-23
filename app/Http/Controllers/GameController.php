<?php

namespace App\Http\Controllers;

use App\Http\Requests\GameRequest;
use App\Models\Game;

class GameController extends Controller
{
    public function index()
    {
        return Game::all();
    }

    public function store(GameRequest $request)
    {
        return Game::create($request->validated());
    }

    public function show(Game $game)
    {
        return $game;
    }

    public function update(GameRequest $request, Game $game)
    {
        $game->update($request->validated());

        return $game;
    }

    public function destroy(Game $game)
    {
        $game->delete();

        return response()->json();
    }
}
