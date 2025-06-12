<?php

namespace App\Http\Controllers;

use App\Http\Requests\adminRequest;
use App\Models\admin;
use function Laravel\Prompts\alert;

class adminController extends Controller
{
    public function index()
    {

        return admin::all();
    }

    public function store(adminRequest $request)
    {
        return admin::create($request->validated());
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

        $user = admin::where('username', $credentials['username'])->first();

        if ($user['password'] === $credentials['password']) {
            return response()->json(['message' => 'Login successful']);
        } else {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

    }
}
