<?php

namespace App\Http\Controllers;

use App\Models\DocumentRequest;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentRequestController extends Controller
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

    // STUDENT: History View (Full List)
    public function index(Request $request)
    {
        $user = $request->user();
        return Inertia::render('student/History', [
            'requests' => $user->requests()->with('documentType')->latest()->get(),
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
        $validated = $request->validate([
            'document_type_id' => 'required|exists:document_types,id',
            'purpose'          => 'required|string',
            'copies'           => 'required|integer|min:1',
        ]);

        $request->user()->requests()->create($validated);

        return redirect()->route('student.history')
            ->with('message','Request submitted successfully!');
    }

    // ADMIN: Dashboard View
    public function adminIndex()
    {
        return Inertia::render('admin/Dashboard', [
            'allRequests' => DocumentRequest::with(['user','documentType'])->latest()->get(),
            'stats' => [
                'total'     => DocumentRequest::count(),
                'pending'   => DocumentRequest::where('status','Pending')->count(),
                'completed' => DocumentRequest::where('status','Completed')->count(),
            ],
        ]);
    }

    // ADMIN: Full list of requests (separate page)
    public function adminRequests()
    {
        return Inertia::render('admin/requests', [
            'requests' => DocumentRequest::with(['user','documentType'])->latest()->get(),
        ]);
    }

    // ADMIN: Show single request details
    public function adminShow(DocumentRequest $request)
    {
        $request->load(['user','documentType']);
        return Inertia::render('admin/RequestShow', ['request'=>$request]);
    }

    // ADMIN: Edit form
    public function adminEdit(DocumentRequest $request)
    {
        return Inertia::render('admin/RequestEdit', [
            'request'=>$request->load(['user','documentType']),
            'documentTypes'=>DocumentType::all(),
        ]);
    }

    // ADMIN: Update request details
    public function adminUpdate(Request $request, DocumentRequest $documentRequest)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Approved,Processing,Completed,Rejected',
            'purpose' => 'sometimes|string',
            'copies' => 'sometimes|integer|min:1',
            'document_type_id' => 'sometimes|exists:document_types,id',
        ]);

        $documentRequest->update($validated);

        return redirect()->route('admin.requests.index')
            ->with('message','Request updated successfully');
    }

    // ADMIN: Delete request
    public function adminDestroy(DocumentRequest $request)
    {
        $request->delete();
        return redirect()->route('admin.requests.index')
            ->with('message','Request deleted');
    }

    public function reportsIndex()
    {
        return Inertia::render('admin/reports', [
            'requests'=>DocumentRequest::with(['user','documentType'])->latest()->get(),
        ]);
    }

    public function updateStatus(Request $request, DocumentRequest $documentRequest)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Approved,Processing,Completed,Rejected',
        ]);
        $documentRequest->update($validated);
        return back()->with('message','Status updated to '.$documentRequest->status);
    }
}
