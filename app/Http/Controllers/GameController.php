<?php

namespace App\Http\Controllers;

use App\Http\Requests\GameRequest;
use App\Models\Game;
use Log;

class GameController extends Controller
{
    public function index()
    {
        Log::alert('index game 1');
        return Game::with('players')->get();
    }

    public function store(GameRequest $request)
    {
        Log::alert('store game 1');
        $validatedData = $request->validated();
        Log::alert('store game 2');

        $game = Game::create([
            'coffee_count' => $validatedData['coffee_count'],
            'date' => $validatedData['date'] ?? now()->toDateString(),
            'damage_loser_id' => $validatedData['damage_loser_id'],
            'concept_loser_id' => $validatedData['concept_loser_id'],
        ]);

        if (isset($validatedData['players']) && is_array($validatedData['players'])) {
            $game->players()->sync($validatedData['players']);
        }

        $game->load('players');

        Log::alert('store game 3 finished');

        return response()->json($game, 201);
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
