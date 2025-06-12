<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class admin extends Model
{

    protected $fillable = [
        'username',
        'password',
    ];


    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];
}
