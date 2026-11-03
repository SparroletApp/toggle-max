```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\ContactController;

Route::post('/login', [UserController::class, 'login']);

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);
Route::get('/faqs', [FaqController::class, 'index']);
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{id}', [BlogController::class, 'show']);
Route::get('/portfolio', [PortfolioController::class, 'index']);
Route::get('/portfolio/{id}', [PortfolioController::class, 'show']);
Route::post('/contact', [ContactController::class, 'store']);

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {

    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'data' => $request->user(),
        ]);
    });

    Route::post('/logout', [UserController::class, 'logout']);

    Route::post('/courses', [CourseController::class, 'store']);
    Route::post('/courses/{id}', [CourseController::class, 'update']);
    Route::post('/courses/{id}/delete', [CourseController::class, 'destroy']);

    Route::post('/blogs', [BlogController::class, 'store']);
    Route::post('/blogs/{id}', [BlogController::class, 'update']);
    Route::post('/blogs/{id}/delete', [BlogController::class, 'destroy']);

    Route::get('/portfolio', [PortfolioController::class, 'index']);
    Route::get('/portfolio/{id}', [PortfolioController::class, 'show']);
    Route::post('/portfolio', [PortfolioController::class, 'store']);
    Route::post('/portfolio/{id}', [PortfolioController::class, 'update']);
    Route::post('/portfolio/{id}/delete', [PortfolioController::class, 'destroy']);

    Route::get('/faqs', [FaqController::class, 'index']);
    Route::get('/faqs/{id}', [FaqController::class, 'show']);
    Route::post('/faqs', [FaqController::class, 'store']);
    Route::post('/faqs/{id}', [FaqController::class, 'update']);
    Route::post('/faqs/{id}/delete', [FaqController::class, 'destroy']);

    Route::post('/contacts/all', [ContactController::class, 'getAll']);
    Route::post('/contacts/view', [ContactController::class, 'getById']);
    Route::post('/contacts/{id}/delete', [ContactController::class, 'delete']);
});