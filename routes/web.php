<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\adminController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/login', [AuthenticatedSessionController::class, 'create'])
    ->name('login');

Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/api/auth/login', [adminController::class, 'login'])->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class);

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');

Route::get('/', function () {
    return Inertia::render('home');
})->name('home')->middleware('auth');

