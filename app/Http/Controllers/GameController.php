<?php

namespace App\Http\Controllers;

use App\Http\Requests\GameRequest;
use App\Models\Game;
use Log;

class GameController extends Controller
{
    public function index()
    {
        return Game::with('players')->get();
    }

    public function store(GameRequest $request)
    {
        $validatedData = $request->validated();
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

    public function reduceDebt()
    {
        $request = request();
        $fromPlayerId = $request->input('from_player_id');
        $toPlayerId = $request->input('to_player_id');

        if (!$fromPlayerId || !$toPlayerId) {
            return response()->json(['error' => 'Missing player IDs'], 400);
        }

        $game = Game::create([
            'coffee_count' => 1,
            'date' => now()->toDateString(),
            'damage_loser_id' => $toPlayerId,
            'concept_loser_id' => null,
        ]);

        $game->players()->sync([$fromPlayerId, $toPlayerId]);

        return response()->json(['message' => 'Debt reduced successfully']);
    }
}
