<?php

use App\Http\Controllers\adminController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::apiResource('users', UserController::class);
Route::apiResource('games', GameController::class);
Route::apiResource( 'admins', AdminController::class);
Route::post('/games/reduce-debt', [GameController::class, 'reduceDebt']);

