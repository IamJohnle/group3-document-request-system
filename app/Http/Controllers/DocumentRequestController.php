<?php

namespace App\Http\Controllers;

use App\Models\DocumentRequest;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentRequestController extends Controller
{
    public function index(Request $request) {
        $user = $request->user();
        return Inertia::render('student/History',[
            'requests' => $user->requests()->with('documentType')->latest()->get(),
            'availableTypes' => DocumentType::all()
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'document_type_id' => 'required|exists:document_types,id',
            'purpose' => 'required|string',
            'copies' => 'required|integer|min:1',
        ]);
        $request->user()->requests()->create($validated);
        return redirect()->route('student.history');
    }

    public function adminIndex() {
        return Inertia::render('admin/dashboard',[
            'allRequests' => DocumentRequest::with(['user', 'documentType'])->latest()->get(),
            'stats' =>[
                'total' => DocumentRequest::count(),
                'pending' => DocumentRequest::where('status', 'Pending')->count(),
                'completed' => DocumentRequest::where('status', 'Completed')->count(),
            ]
        ]);
    }

    public function indexAdmin() {
        return Inertia::render('admin/requests', [
            'requests' => DocumentRequest::with(['user', 'documentType'])->latest()->get(),
        ]);
    }

    public function reportsIndex() {
        return Inertia::render('admin/reports', [
            'requests' => DocumentRequest::with(['user', 'documentType'])->latest()->get(),
        ]);
    }

    public function updateStatus(Request $request, DocumentRequest $docRequest) {
        // Ensure 'status' is in the $fillable array of the DocumentRequest model
        $docRequest->update($request->validate(['status' => 'required|string']));
        return back();
    }
}