<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'FAQs fetched successfully',
            'data' => $faqs,
        ], 200);
    }

    public function show($id)
    {
        $faq = Faq::find($id);

        if (!$faq) {
            return response()->json([
                'success' => false,
                'message' => 'FAQ not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'FAQ fetched successfully',
            'data' => $faq,
        ], 200);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        $faq = Faq::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'FAQ created successfully',
            'data' => $faq,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $faq = Faq::find($id);

        if (!$faq) {
            return response()->json([
                'success' => false,
                'message' => 'FAQ not found',
            ], 404);
        }

        $validated = $request->validate([
            'question' => 'sometimes|required|string',
            'answer' => 'sometimes|required|string',
        ]);

        $faq->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'FAQ updated successfully',
            'data' => $faq,
        ], 200);
    }

    public function destroy($id)
    {
        $faq = Faq::find($id);

        if (!$faq) {
            return response()->json([
                'success' => false,
                'message' => 'FAQ not found',
            ], 404);
        }

        $faq->delete();

        return response()->json([
            'success' => true,
            'message' => 'FAQ deleted successfully',
        ], 200);
    }
}
