<?php


use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');


Route::get('/auth/login', function () {
    return Inertia::render('auth/login');
})->name('auth/login');
