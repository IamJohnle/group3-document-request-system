<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class RequestController extends Controller
{
    // STUDENT: Main Dashboard View
    public function dashboard(Request $request)
    {
        $user = $request->user();

        return Inertia::render('student/Dashboard', [
            'stats' => [
                'pending'       => $user->requests()->where('status','Pending')->count(),
                'completed'     => $user->requests()->where('status','Completed')->count(),
                'actionRequired'=> $user->requests()->where('status','Rejected')->count(),
            ],
            'recentRequests' => $user->requests()
                ->with('documentType')
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }

    // STUDENT: Information View (Edit Personal & Academic Info)
    public function information(Request $request)
{
    $user = Auth::user();

    // Log the role to your terminal/log file to see what it actually is
    // \Log::info('User Role: ' . $user->role);

    if (strtolower($user->role ?? '') !== 'student') {
        abort(403, 'Unauthorized. Your role is: ' . ($user->role ?? 'None'));
    }

    $student = $user->student;

    if (!$student) {
        // Create an empty profile if none exists or abort
        abort(404, 'Student profile not found.');
    }

    return Inertia::render('student/Information', [
        'student' => $student,
    ]);
}

    // STUDENT: Update Student Information
    public function updateInformation(Request $request)
    {
        if (Auth::user()->role !== 'student') {
            abort(403);
        }

        $user = $request->user();
        $student = $user->student;
        if (!$student) {
            abort(404, 'Student profile not found.');
        }

        $validated = $request->validate([
            // Personal Information
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'religion' => 'nullable|string|max:255',

            // Address Information
            'street' => 'nullable|string|max:255',
            'barangay' => 'nullable|string|max:255',
            'municipality' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',

            // Academic Information
            'course' => 'nullable|string|max:255',
            'year_level' => 'nullable|string|max:255',
            'section' => 'nullable|string|max:255',
        ]);

        $student->update($validated);

        return Inertia::render('student/Information', [
            'student' => $student,
        ])->with('message', 'Information updated successfully!');
    }

    // STUDENT: History View (Full List)
    public function history(Request $request)
    {
        if (Auth::user()->role !== 'student') {
            abort(403);
        }

        $user = $request->user();
        return Inertia::render('student/History', [
            'requests' => $user->requests()->with('documentType')->latest()->get(),
        ]);
    }

    // STUDENT: Show Request Details
    public function show(DocumentRequest $documentRequest)
    {
        // Safety check: ensure the student owns this request
        if ($documentRequest->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('student/RequestDetails', [
            'request' => $documentRequest->load('documentType')
        ]);
    }

    // STUDENT: Show Request Form
    public function create()
    {
        return Inertia::render('student/RequestForm', [
            'documentTypes' => DocumentType::all(),
        ]);
    }

    // STUDENT: Submit New Request
    public function store(Request $request)
    {
        Log::info('RequestController@store called', $request->all());

        $validated = $request->validate([
            'document_type_id' => 'required|exists:document_types,id',
            'purpose'          => 'required|string',
            'copies'           => 'required|integer|min:1',
            'file'             => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        Log::info('Validation passed', $validated);

        // Handle optional attachment upload
        if ($request->hasFile('file')) {
            $validated['attachment'] = $request->file('file')->store('attachments', 'public');
        }

        $request->user()->requests()->create($validated);

        return redirect()->route('student.history')
            ->with('message','Request submitted successfully!');
    }
}
