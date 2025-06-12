<?php

namespace App\Http\Middleware;

use Auth;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use function Laravel\Prompts\alert;


class Authenticate extends Middleware
{
    protected function redirectTo($request): ?string
    {
        \Log::info('Auth middleware check:', [
            'authenticated' => Auth::check(),
            'user_id' => Auth::id(),
            'session_id' => $request->session()->getId(),
            'url' => $request->url(),
            'guard' => Auth::getDefaultDriver()
        ]);
        
        alert('Auth middleware triggered - User: ' . (Auth::check() ? 'authenticated' : 'not authenticated'));
        
        if (! $request->expectsJson()) {
            return route('login');
        }
        return null;
    }
}
