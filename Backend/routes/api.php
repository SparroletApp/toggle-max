<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\PortfolioController;

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{id}', [BlogController::class, 'show']);

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {

    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'data' => $request->user(),
        ]);
    });

    Route::post('/courses', [CourseController::class, 'store']);
    Route::post('/courses/{id}', [CourseController::class, 'update']);
    Route::post('/courses/{id}/delete', [CourseController::class, 'destroy']);
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::post('/blogs/{id}', [BlogController::class, 'update']);
    Route::post('/blogs/{id}/delete', [BlogController::class, 'destroy']);
    
    Route::post('/portfolio', [PortfolioController::class, 'store']);
    Route::post('/portfolio/{id}', [PortfolioController::class, 'update']);
    Route::post('/portfolio/{id}/delete', [PortfolioController::class, 'destroy']);
});