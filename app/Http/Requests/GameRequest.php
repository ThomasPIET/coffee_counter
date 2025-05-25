<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GameRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'coffee_count' => ['required', 'integer'],
            'date' => ['nullable', 'date'],
            'damage_loser_id' => ['nullable', 'integer'],
            'concept_loser_id' => ['required', 'integer'],
            'players' => ['required', 'array'],
            'players.*' => ['integer', 'exists:users,id'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
