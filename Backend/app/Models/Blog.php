<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = [
        'badge_title',
        'title',
        'desc',
        'main_image',
        'images',
        'questions_answers',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'questions_answers' => 'array',
        ];
    }
}