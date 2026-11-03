<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    public function store(Request $request)
    {
        $keyPoints = json_decode(
            $request->input('keyPoints', '[]'),
            true
        );

        $curriculum = json_decode(
            $request->input('curriculum', '[]'),
            true
        );

        if (!is_array($keyPoints)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid key points format.',
            ], 422);
        }

        if (!is_array($curriculum)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid curriculum format.',
            ], 422);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'desc' => 'required|string',
            'months' => 'required|integer|min:1',
            'days' => 'nullable|integer|min:0',
            'badge' => 'nullable|string|max:255',
            'image' => 'required|image|mimes:png,jpg,jpeg,webp|max:20480',
        ]);

        foreach ($keyPoints as $point) {

            if (
                !is_array($point) ||
                empty(trim($point['title'] ?? ''))
            ) {
                return response()->json([
                    'success' => false,
                    'message' => 'Every key point must have a title.',
                ], 422);
            }
        }

        foreach ($curriculum as $section) {

            if (
                !is_array($section) ||
                empty(trim($section['title'] ?? ''))
            ) {
                return response()->json([
                    'success' => false,
                    'message' => 'Every curriculum module must have a title.',
                ], 422);
            }

            if (!is_array($section['points'] ?? [])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Curriculum topics must be an array.',
                ], 422);
            }
        }

        $data = [
            'title' => $validated['title'],

            'description' => $validated['desc'],

            'months' => $validated['months'],

            'days' => $validated['days'] ?? null,

            'badge' => $validated['badge'] ?? null,

            'key_points' => $keyPoints,

            'curriculum_title' => $curriculum[0]['title'] ?? null,

            'curriculum_description' => $curriculum[0]['desc'] ?? null,

            'curriculum_points' => $curriculum,
        ];

        if ($request->hasFile('image')) {

            $data['image'] = $request->file('image')
                ->store('courses', 'public');
        }

        $course = Course::create($data);

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
            'desc' => 'sometimes|required|string',
            'months' => 'sometimes|nullable|integer|min:0',
            'days' => 'sometimes|nullable|integer|min:0',
            'badge' => 'sometimes|nullable|string|max:255',
            'image' => 'sometimes|nullable|image|mimes:png,jpg,jpeg,webp|max:20480',
        ]);

        $data = [];

        if (array_key_exists('title', $validated)) {
            $data['title'] = $validated['title'];
        }

        if (array_key_exists('desc', $validated)) {
            $data['description'] = $validated['desc'];
        }

        if (array_key_exists('months', $validated)) {
            $data['months'] = $validated['months'];
        }

        if (array_key_exists('days', $validated)) {
            $data['days'] = $validated['days'];
        }

        if (array_key_exists('badge', $validated)) {
            $data['badge'] = $validated['badge'];
        }

        if ($request->has('keyPoints')) {

            $keyPoints = json_decode(
                $request->input('keyPoints'),
                true
            );

            if (!is_array($keyPoints)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid key points format.',
                ], 422);
            }

            foreach ($keyPoints as $point) {

                if (
                    !is_array($point) ||
                    empty(trim($point['title'] ?? ''))
                ) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Every key point must have a title.',
                    ], 422);
                }
            }

            $data['key_points'] = $keyPoints;
        }

        if ($request->has('curriculum')) {

            $curriculum = json_decode(
                $request->input('curriculum'),
                true
            );

            if (!is_array($curriculum)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid curriculum format.',
                ], 422);
            }

            foreach ($curriculum as $section) {

                if (
                    !is_array($section) ||
                    empty(trim($section['title'] ?? ''))
                ) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Every curriculum module must have a title.',
                    ], 422);
                }

                if (!is_array($section['points'] ?? [])) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Curriculum topics must be an array.',
                    ], 422);
                }
            }

            $data['curriculum_title'] =
                $curriculum[0]['title'] ?? null;

            $data['curriculum_description'] =
                $curriculum[0]['desc'] ?? null;
            $data['curriculum_points'] = $curriculum;
        }

        if ($request->hasFile('image')) {

            if (
                $course->image &&
                Storage::disk('public')->exists($course->image)
            ) {
                Storage::disk('public')->delete($course->image);
            }

            $data['image'] = $request->file('image')
                ->store('courses', 'public');
        }

        $course->update($data);

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

        if (
            $course->image &&
            Storage::disk('public')->exists($course->image)
        ) {
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