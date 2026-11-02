<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'title',
        'description',
        'key_points',
        'months',
        'image',
        'badge',
        'curriculum_title',
        'curriculum_description',
        'curriculum_points',
        'days',
    ];

    protected function casts(): array
    {
        return [
            'key_points' => 'array',
            'curriculum_points' => 'array',
            'months' => 'integer',
            'days' => 'integer',
        ];
    }
}
