<?php

namespace App\Http\Controllers;

use App\Models\DocumentRequest;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentRequestController extends Controller
{
    /**
     * STUDENT: Main Dashboard View
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();

        return Inertia::render('student/Dashboard', [
            'stats' => [
                'pending' => $user->requests()->where('status', 'Pending')->count(),
                'completed' => $user->requests()->where('status', 'Completed')->count(),
                'actionRequired' => $user->requests()->where('status', 'Rejected')->count(),
            ],
            'recentRequests' => $user->requests()
                ->with('documentType')
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }

    /**
     * STUDENT: History View (Full List)
     */
    public function index(Request $request)
    {
        $user = $request->user();
        return Inertia::render('student/History', [
            'requests' => $user->requests()->with('documentType')->latest()->get(),
        ]);
    }

    /**
     * STUDENT: Show Request Form
     */
    public function create()
    {
        return Inertia::render('student/RequestForm', [
            'documentTypes' => DocumentType::all()
        ]);
    }

    /**
     * STUDENT: Submit New Request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'document_type_id' => 'required|exists:document_types,id',
            'purpose' => 'required|string',
            'copies' => 'required|integer|min:1',
        ]);

        $request->user()->requests()->create($validated);

        return redirect()->route('student.history')->with('message', 'Request submitted successfully!');
    }

    /**
     * ADMIN: Dashboard View
     */
    public function adminIndex()
    {
        // NOTE: the page file is named Dashboard.tsx (capital D), so the
        // Inertia name must match exactly. Previously this was lower‑case and
        // resulted in the "Page not found" error in the browser.
        return Inertia::render('admin/Dashboard', [
            'allRequests' => DocumentRequest::with(['user', 'documentType'])->latest()->get(),
            'stats' => [
                'total' => DocumentRequest::count(),
                'pending' => DocumentRequest::where('status', 'Pending')->count(),
                'completed' => DocumentRequest::where('status', 'Completed')->count(),
            ]
        ]);
    }

    /**
     * ADMIN: List Document Types
     */
    public function documentTypes()
    {
        return Inertia::render('admin/DocumentTypes', [
            'types' => DocumentType::all(),
        ]);
    }

    /**
     * ADMIN: Create Document Type
     */
    public function storeType(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        DocumentType::create($validated);
        return back()->with('message', 'Document type added successfully!');
    }

    /**
     * ADMIN: Update Document Type
     */
    public function updateType(Request $request, $id)
    {
        $type = DocumentType::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $type->update($validated);
        return back()->with('message', 'Document type updated successfully!');
    }

    /**
     * ADMIN: Delete Document Type
     */
    public function destroyType($id)
    {
        DocumentType::findOrFail($id)->delete();
        return back()->with('message', 'Document type deleted successfully!');
    }

    /**
     * ADMIN: Update Request Status
     */
    public function updateStatus(Request $request, DocumentRequest $docRequest)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Approved,Processing,Completed,Rejected'
        ]);

        $docRequest->update($validated);
        return back()->with('message', 'Status updated to ' . $request->status);
    }

    /**
     * ADMIN: Full list of requests (separate page)
     */
    public function adminRequests()
    {
        return Inertia::render('admin/Requests', [
            'requests' => DocumentRequest::with(['user', 'documentType'])->latest()->get(),
        ]);
    }

    /**
     * ADMIN: Show single request details
     */
    public function adminShow(DocumentRequest $docRequest)
    {
        $docRequest->load(['user', 'documentType']);
        return Inertia::render('admin/RequestShow', ['request' => $docRequest]);
    }

    /**
     * ADMIN: Edit form
     */
    public function adminEdit(DocumentRequest $docRequest)
    {
        return Inertia::render('admin/RequestEdit', [
            'request' => $docRequest->load(['user', 'documentType']),
            'documentTypes' => DocumentType::all(),
        ]);
    }

    /**
     * ADMIN: Update request details
     */
    public function adminUpdate(Request $request, DocumentRequest $docRequest)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Approved,Processing,Completed,Rejected',
            'purpose' => 'sometimes|string',
            'copies' => 'sometimes|integer|min:1',
            'document_type_id' => 'sometimes|exists:document_types,id',
        ]);

        $docRequest->update($validated);
        return redirect()->route('admin.requests.index')->with('message', 'Request updated successfully');
    }

    /**
     * ADMIN: Delete request
     */
    public function adminDestroy(DocumentRequest $docRequest)
    {
        $docRequest->delete();
        return redirect()->route('admin.requests.index')->with('message', 'Request deleted');
    }

    public function reportsIndex()
    {
        return Inertia::render('admin/Reports', [
            // Ensure you have a 'file_path' or 'image' field in your DocumentRequest model
            'requests' => DocumentRequest::with(['user', 'documentType'])->latest()->get()
        ]);
    }
}
