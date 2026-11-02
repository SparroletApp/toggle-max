<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'key_points' => 'nullable|array',
            'key_points.*.title' => 'required_with:key_points|string|max:255',
            'key_points.*.name' => 'required_with:key_points|string|max:255',
            'key_points.*.description' => 'required_with:key_points|string',
            'months' => 'nullable|integer|min:0',
            'days' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'badge' => 'nullable|string|max:255',
            'curriculum_title' => 'nullable|string|max:255',
            'curriculum_description' => 'nullable|string',
            'curriculum_points' => 'nullable|array',
            'curriculum_points.*' => 'required_with:curriculum_points|string|max:1000',
        ]);
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')
                ->store('courses', 'public');
        }

        $course = Course::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Course created successfully.',
            'data' => $this->formatCourse($course),
        ], 201);
    }

    public function index()
    {
        $courses = Course::latest()
            ->get()
            ->map(fn (Course $course) => $this->formatCourse($course));

        return response()->json([
            'success' => true,
            'message' => 'Courses retrieved successfully.',
            'data' => $courses,
        ], 200);
    }

    public function show(string $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Course retrieved successfully.',
            'data' => $this->formatCourse($course),
        ], 200);
    }

    public function update(Request $request, string $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found.',
            ], 404);
        }
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'key_points' => 'sometimes|nullable|array',
            'key_points.*.title' => 'required_with:key_points|string|max:255',
            'key_points.*.name' => 'required_with:key_points|string|max:255',
            'key_points.*.description' => 'required_with:key_points|string',
            'months' => 'sometimes|nullable|integer|min:0',
            'days' => 'sometimes|nullable|integer|min:0',
            'image' => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'badge' => 'sometimes|nullable|string|max:255',
            'curriculum_title' => 'sometimes|nullable|string|max:255',
            'curriculum_description' => 'sometimes|nullable|string',
            'curriculum_points' => 'sometimes|nullable|array',
            'curriculum_points.*' => 'required_with:curriculum_points|string|max:1000',
        ]);

        if ($request->hasFile('image')) {
            $oldImage = $course->image;
            $newImage = $request->file('image')
                ->store('courses', 'public');
            $validated['image'] = $newImage;
            if ($oldImage) {
                Storage::disk('public')->delete($oldImage);
            }
        } else {
            unset($validated['image']);
        }

        $course->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Course updated successfully.',
            'data' => $this->formatCourse($course->fresh()),
        ], 200);
    }

    public function destroy(string $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found.',
            ], 404);
        }

        if ($course->image) {
            Storage::disk('public')->delete($course->image);
        }
        $course->delete();

        return response()->json([
            'success' => true,
            'message' => 'Course and its image deleted successfully.',
        ], 200);
    }

    private function formatCourse(Course $course): array
    {
        $data = $course->toArray();

        $data['image_url'] = $course->image
            ? asset('storage/' . $course->image)
            : null;

        return $data;
    }
}
