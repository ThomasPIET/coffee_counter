<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'coffee_count',
        'date',
        'damage_loser_id',
        'concept_loser_id',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
        ];
    }

    public function players()
    {
       return $this->belongsToMany(User::class);
    }

    public function damageLoser()
    {
        return $this->belongsTo(User::class, 'damage_loser_id');
    }
    public function conceptlooser()
    {
        return $this->belongsTo(User::class, 'concept_loser_id');
    }
}
