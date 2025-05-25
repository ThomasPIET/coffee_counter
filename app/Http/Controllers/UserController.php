<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Container\Attributes\Log;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(UserRequest $request)
    {

        $validatedData = $request->validated();
        $user =  User::create($validatedData);

        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return $user;
    }

    public function update(UserRequest $request, User $user)
    {
        $user->update($request->validated());

        return $user;
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json();
    }
}
