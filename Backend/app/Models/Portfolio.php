<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    protected $fillable = [
        'category',
        'category_desc',
        'portfolio_badge',
        'project_owner',
        'title',
        'desc',
        'image',
        'details',
        'objectives',
        'concepts',
    ];

    protected function casts(): array
    {
        return [
            'details' => 'array',
            'objectives' => 'array',
            'concepts' => 'array',
        ];
    }
}