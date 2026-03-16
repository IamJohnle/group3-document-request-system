<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RequestController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('admin/Dashboard', [
            // Ensure the key matches 'allRequests' exactly
            'allRequests' => DocumentRequest::with(['user', 'documentType'])->get(),
            'stats' => [
                'total' => DocumentRequest::count(),
                'pending' => DocumentRequest::where('status', 'Pending')->count(),
                'completed' => DocumentRequest::where('status', 'Completed')->count(),
            ],
        ]);
    }

    public function index()
    {
        return Inertia::render('admin/requests', [
            // CHANGED: Document_types to documentType
            'requests' => DocumentRequest::with(['user','documentType'])->latest()->get(),
        ]);
    }

    public function show(DocumentRequest $documentRequest)
    {
        $documentRequest->load(['user','documentType']);
        return Inertia::render('admin/RequestShow', ['request' => $documentRequest]);
    }

    public function edit(DocumentRequest $documentRequest)
    {
        $documentRequest->load(['user','documentType']);
        return Inertia::render('admin/RequestEdit', [
            'request' => $documentRequest,
            'documentTypes' => DocumentType::all(),
        ]);
    }

    public function update(Request $request, DocumentRequest $documentRequest)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Approved,Processing,Completed,Rejected',
            'purpose' => 'required|string',
            'copies' => 'required|integer|min:1',
        ]);

        $documentRequest->update($validated);

        return redirect()->route('admin.requests.show', $documentRequest)->with('message', 'Request updated successfully');
    }

    public function destroy(DocumentRequest $documentRequest)
    {
        $documentRequest->delete();
        return redirect()->route('admin.requests.index')->with('message', 'Request deleted successfully');
    }

    public function reports()
    {
        return Inertia::render('admin/Reports', [
            // CHANGED: Document_types to documentType
            'requests' => DocumentRequest::with(['user','documentType'])->latest()->get(),
        ]);
    }

    public function updateStatus(Request $request, DocumentRequest $documentRequest)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Approved,Processing,Completed,Rejected',
        ]);

        $documentRequest->update($validated);

        return back()->with('message', 'Status updated to ' . $documentRequest->status);
    }
}
