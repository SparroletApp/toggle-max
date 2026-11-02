<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Blogs retrieved successfully.',
            'data' => $blogs,
        ], 200);
    }

    public function show(Request $request)
    {
        $request->validate([
            'id' => ['required', 'integer', 'min:1'],
        ]);

        $blog = Blog::find($request->id);

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Blog not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Blog retrieved successfully.',
            'data' => $blog,
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'badge_title' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'desc' => ['nullable', 'string'],

            'main_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:4096',
            ],

            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:4096',
            ],

            'questions_answers' => ['nullable', 'array'],
            'questions_answers.*.question' => [
                'required',
                'string',
            ],
            'questions_answers.*.answer' => [
                'required',
                'string',
            ],
        ]);

        $uploadedFiles = [];

        try {
            if ($request->hasFile('main_image')) {
                $validated['main_image'] = $request
                    ->file('main_image')
                    ->store('blogs', 'public');

                $uploadedFiles[] = $validated['main_image'];
            }

            if ($request->hasFile('images')) {
                $imagePaths = [];

                foreach ($request->file('images') as $image) {
                    $path = $image->store('blogs', 'public');

                    $imagePaths[] = $path;
                    $uploadedFiles[] = $path;
                }

                $validated['images'] = $imagePaths;
            }

            $blog = Blog::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Blog created successfully.',
                'data' => $blog,
            ], 201);
        } catch (\Throwable $e) {
            Storage::disk('public')->delete($uploadedFiles);

            throw $e;
        }
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => ['required', 'integer', 'min:1'],

            'badge_title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'desc' => ['sometimes', 'nullable', 'string'],

            'main_image' => [
                'sometimes',
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:4096',
            ],

            'images' => ['sometimes', 'array', 'max:10'],
            'images.*' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:4096',
            ],

            'questions_answers' => ['sometimes', 'nullable', 'array'],
            'questions_answers.*.question' => [
                'required',
                'string',
            ],
            'questions_answers.*.answer' => [
                'required',
                'string',
            ],

            'remove_main_image' => ['sometimes', 'boolean'],

            'remove_images' => ['sometimes', 'boolean'],
        ]);

        $blog = Blog::find($validated['id']);

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Blog not found.',
            ], 404);
        }

        $uploadedFiles = [];

        try {
            if ($request->boolean('remove_main_image')) {
                if ($blog->main_image) {
                    Storage::disk('public')->delete($blog->main_image);
                }

                $blog->main_image = null;
            } elseif ($request->hasFile('main_image')) {
                $newMainImage = $request->file('main_image')
                    ->store('blogs', 'public');

                $uploadedFiles[] = $newMainImage;

                if ($blog->main_image) {
                    Storage::disk('public')->delete($blog->main_image);
                }

                $blog->main_image = $newMainImage;
            }

            if ($request->boolean('remove_images')) {
                Storage::disk('public')->delete($blog->images ?? []);

                $blog->images = [];
            } elseif ($request->hasFile('images')) {
                $newImagePaths = [];

                foreach ($request->file('images') as $image) {
                    $path = $image->store('blogs', 'public');

                    $newImagePaths[] = $path;
                    $uploadedFiles[] = $path;
                }

                Storage::disk('public')->delete($blog->images ?? []);

                $blog->images = $newImagePaths;
            }

            foreach (['badge_title', 'title', 'desc', 'questions_answers'] as $field) {
                if (array_key_exists($field, $validated)) {
                    $blog->{$field} = $validated[$field];
                }
            }

            $blog->save();

            return response()->json([
                'success' => true,
                'message' => 'Blog updated successfully.',
                'data' => $blog->fresh(),
            ], 200);
        } catch (\Throwable $e) {
            Storage::disk('public')->delete($uploadedFiles);

            throw $e;
        }
    }


    public function destroy(Request $request)
    {
        $request->validate([
            'id' => ['required', 'integer', 'min:1'],
        ]);

        $blog = Blog::find($request->id);

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Blog not found.',
            ], 404);
        }

        // Delete the main image.
        if ($blog->main_image) {
            Storage::disk('public')->delete($blog->main_image);
        }

        if (!empty($blog->images)) {
            Storage::disk('public')->delete($blog->images);
        }

        $blog->delete();

        return response()->json([
            'success' => true,
            'message' => 'Blog deleted successfully.',
        ], 200);
    }
}