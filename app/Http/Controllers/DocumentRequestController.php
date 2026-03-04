<?php

namespace App\Http\Controllers;

use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class DocumentRequestController extends Controller {

    // --- STUDENT FUNCTIONS ---

    // View my request history
    public function index(Request $request)
{
    /** @var \App\Models\User $user */
     $user = $request->user();

    return Inertia::render('Student/History', [
        'requests' => $user->requests()->with('documentType')->latest()->get(),
        'availableTypes' => DocumentType::all()
    ]);
}

    // Submit a new request
    public function store(Request $request) {
        $validated = $request->validate([
            'document_type' => 'required|string',
            'purpose' => 'required|string',
            'copies' => 'required|integer|min:1',
            'attachment' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
        ]);

        if ($request->hasFile('attachment')) {
            $validated['attachment'] = $request->file('attachment')->store('requirements', 'public');
        }

        $request->user()->requests()->create($validated);

        return redirect()->route('student.history')->with('success', 'Request Submitted!');
    }

    // --- ADMIN FUNCTIONS ---

    // View all requests + Reporting Stats
    public function adminIndex() {
    return Inertia::render('Admin/Dashboard', [
        // Include the document type name for the admin to see
        'allRequests' => DocumentRequest::with(['user', 'documentType'])->latest()->get(),
        'stats' => [
            'total' => DocumentRequest::count(),
            'pending' => DocumentRequest::where('status', 'Pending')->count(),
            'completed' => DocumentRequest::where('status', 'Completed')->count(),
        ]
    ]);
}

    // Update status and add notes (Module C)
    public function updateStatus(Request $request, DocumentRequest $docRequest) {
        $validated = $request->validate([
            'status' => 'required',
            'admin_notes' => 'nullable|string',
            'final_file' => 'nullable|file|mimes:pdf|max:5000',
        ]);

        if ($request->hasFile('final_file')) {
            $validated['final_file'] = $request->file('final_file')->store('completed_docs', 'public');
        }

        $docRequest->update($validated);
        return back()->with('success', 'Request Updated');
    }
}
