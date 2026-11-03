<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|max:255',
            'phone'      => 'required|string|max:20',
            'subject'    => 'required|string|max:255',
            'message'    => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $contact = Contact::create([
                'first_name' => $request->first_name,
                'last_name'  => $request->last_name,
                'email'      => $request->email,
                'phone'      => $request->phone,
                'subject'    => $request->subject,
                'message'    => $request->message,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Your enquiry has been submitted successfully.',
                'data' => $contact,
            ], 201);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Unable to submit your enquiry.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function getAll(Request $request)
    {
        try {
            $contacts = Contact::latest()->get();

            return response()->json([
                'success' => true,
                'message' => 'Contact enquiries fetched successfully.',
                'data' => $contacts,
            ], 200);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Unable to fetch contact enquiries.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getById(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|exists:contact,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid contact ID.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $contact = Contact::find($request->id);

            return response()->json([
                'success' => true,
                'message' => 'Contact enquiry fetched successfully.',
                'data' => $contact,
            ], 200);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Unable to fetch contact enquiry.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

public function delete($id)
{
    try {

        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Contact enquiry not found.',
            ], 404);
        }

        $contact->delete();

        return response()->json([
            'success' => true,
            'message' => 'Contact enquiry deleted successfully.',
        ], 200);

    } catch (\Exception $e) {

        return response()->json([
            'success' => false,
            'message' => 'Unable to delete contact enquiry.',
            'error' => $e->getMessage(),
        ], 500);

    }
}
}
