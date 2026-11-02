<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PortfolioController extends Controller
{

    public function index()
    {
        $portfolios = Portfolio::latest()->get()->map(
            fn ($portfolio) => $this->formatPortfolio($portfolio)
        );

        return response()->json([
            'success' => true,
            'message' => 'Portfolios retrieved successfully.',
            'data' => $portfolios,
        ], 200);
    }

    public function show($id)
    {
        $portfolio = Portfolio::find($id);

        if (!$portfolio) {
            return response()->json([
                'success' => false,
                'message' => 'Portfolio not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Portfolio retrieved successfully.',
            'data' => $this->formatPortfolio($portfolio),
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => ['required', 'string', 'max:255'],
            'category_desc' => ['nullable', 'string'],
            'portfolio_badge' => ['nullable', 'string', 'max:255'],
            'project_owner' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'desc' => ['nullable', 'string'],
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:4096',
            ],

            'details' => ['nullable', 'array'],
            'details.*.title' => ['required', 'string'],
            'details.*.heading' => ['required', 'string'],
            'objectives' => ['nullable', 'array'],
            'objectives.*.title' => ['required', 'string'],
            'objectives.*.desc' => ['required', 'string'],
            'concepts' => ['nullable', 'array'],
            'concepts.*.title' => ['required', 'string'],
            'concepts.*.desc' => ['required', 'string'],
        ]);

        $imagePath = null;

        try {
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')
                    ->store('portfolio', 'public');

                $validated['image'] = $imagePath;
            }

            $portfolio = Portfolio::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Portfolio created successfully.',
                'data' => $this->formatPortfolio($portfolio),
            ], 201);
        } catch (\Throwable $e) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }

            throw $e;
        }
    }

    public function update(Request $request, $id)
    {
        $portfolio = Portfolio::find($id);

        if (!$portfolio) {
            return response()->json([
                'success' => false,
                'message' => 'Portfolio not found.',
            ], 404);
        }

        $validated = $request->validate([
            'category' => ['sometimes', 'required', 'string', 'max:255'],
            'category_desc' => ['sometimes', 'nullable', 'string'],
            'portfolio_badge' => ['sometimes', 'nullable', 'string', 'max:255'],
            'project_owner' => ['sometimes', 'nullable', 'string', 'max:255'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'desc' => ['sometimes', 'nullable', 'string'],

            'image' => [
                'sometimes',
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:4096',
            ],

            'remove_image' => ['sometimes', 'boolean'],
            'details' => ['sometimes', 'nullable', 'array'],
            'details.*.title' => ['required', 'string'],
            'details.*.heading' => ['required', 'string'],
            'objectives' => ['sometimes', 'nullable', 'array'],
            'objectives.*.title' => ['required', 'string'],
            'objectives.*.desc' => ['required', 'string'],
            'concepts' => ['sometimes', 'nullable', 'array'],
            'concepts.*.title' => ['required', 'string'],
            'concepts.*.desc' => ['required', 'string'],
        ]);

        $newImagePath = null;
        $oldImagePath = $portfolio->image;

        try {
            if ($request->boolean('remove_image')) {
                $portfolio->image = null;
            }
            if ($request->hasFile('image')) {
                $newImagePath = $request->file('image')
                    ->store('portfolio', 'public');

                $portfolio->image = $newImagePath;
            }
            foreach ([
                'category',
                'category_desc',
                'portfolio_badge',
                'project_owner',
                'title',
                'desc',
                'details',
                'objectives',
                'concepts',
            ] as $field) {
                if (array_key_exists($field, $validated)) {
                    $portfolio->{$field} = $validated[$field];
                }
            }

            $portfolio->save();
            if (
                $oldImagePath &&
                $oldImagePath !== $portfolio->image
            ) {
                Storage::disk('public')->delete($oldImagePath);
            }

            return response()->json([
                'success' => true,
                'message' => 'Portfolio updated successfully.',
                'data' => $this->formatPortfolio($portfolio->fresh()),
            ], 200);
        } catch (\Throwable $e) {
            if ($newImagePath) {
                Storage::disk('public')->delete($newImagePath);
            }

            throw $e;
        }
    }

    public function destroy($id)
    {
        $portfolio = Portfolio::find($id);

        if (!$portfolio) {
            return response()->json([
                'success' => false,
                'message' => 'Portfolio not found.',
            ], 404);
        }

        $imagePath = $portfolio->image;

        $portfolio->delete();

        if ($imagePath) {
            Storage::disk('public')->delete($imagePath);
        }

        return response()->json([
            'success' => true,
            'message' => 'Portfolio deleted successfully.',
        ], 200);
    }

    private function formatPortfolio(Portfolio $portfolio): array
    {
        $data = $portfolio->toArray();

        $data['image_url'] = $portfolio->image
            ? Storage::disk('public')->url($portfolio->image)
            : null;

        return $data;
    }
}