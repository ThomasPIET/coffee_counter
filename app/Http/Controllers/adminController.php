<?php

namespace App\Http\Controllers;

use App\Http\Requests\adminRequest;
use App\Models\admin;
use Hash;
use Illuminate\Support\Facades\Auth;
use function Laravel\Prompts\alert;

class adminController extends Controller
{
    public function index()
    {

        return admin::all();
    }

    public function store(adminRequest $request)
    {
        $validatedData = $request->validate([
            'username' => 'required|unique:admins,username',
            'password' => 'required|min:8',
        ]);
        $validatedData['password'] = bcrypt($validatedData['password']);

        $admin = admin::create($validatedData);

        return response()->json($admin, 201);
    }

    public function show(admin $admin)
    {
        return $admin;
    }

    public function update(adminRequest $request, admin $admin)
    {
        $admin->update($request->validated());

        return $admin;
    }

    public function destroy(admin $admin)
    {

        $admin->delete();

        return response()->json();
    }

    public function login(adminRequest $request) {
        $credentials = $request->only('username', 'password');

        alert('login attempt');;

        $user = admin::where('username', $credentials['username'])->first();
        alert('login attempt');;

        if ($user && Hash::check($credentials['password'], $user->password)) {
            Auth::guard('web')->login($user);
            alert('login attempt');;

            $request->session()->regenerate();
            alert('login attempt');;

            if (Auth::check()) {
                alert('User authenticated');
                alert('login attempt');;

            } else {
                alert('User not authenticated');
            }

            alert('login successful final');

            return response()->json(['message' => 'Login successful'])
                ->cookie('laravel_session', $request->session()->getId(), 120, '/', null, false, true);
        } else {
            alert('login attempt');;

            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    }
}
