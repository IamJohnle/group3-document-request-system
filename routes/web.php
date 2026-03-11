<?php

use App\Http\Controllers\StudentController;
use App\Http\Controllers\DocumentRequestController;
use App\Http\Middleware\AdminMiddleware;
use App\Models\DocumentType;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. PUBLIC ROUTE: The Welcome Page
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => true,
    ]);
})->name('home');

// 2. PROTECTED ROUTES (Must be logged in)
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        $user = Auth::user();

        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('student/Dashboard');
    })->name('dashboard');

    // --- ADMIN MODULE ---
    Route::middleware([AdminMiddleware::class])->group(function () {
        // Dashboard
        Route::get('/admin/dashboard', [DocumentRequestController::class, 'adminIndex'])->name('admin.dashboard');
    
    Route::get('/admin/requests', [DocumentRequestController::class, 'indexAdmin'])->name('admin.requests.index');

    Route::get('/admin/reports', [DocumentRequestController::class, 'reportsIndex'])->name('admin.reports');

// ADD THIS: Document Types Management
    Route::get('/admin/document-types', [App\Http\Controllers\DocumentTypeController::class, 'index'])->name('admin.document-types.index');
    Route::post('/admin/document-types', [App\Http\Controllers\DocumentTypeController::class, 'store'])->name('admin.document-types.store');
    Route::put('/admin/document-types/{id}', [App\Http\Controllers\DocumentTypeController::class, 'update'])->name('admin.document-types.update');
    Route::delete('/admin/document-types/{id}', [App\Http\Controllers\DocumentTypeController::class, 'destroy'])->name('admin.document-types.destroy');

    
        // --- STUDENT MANAGEMENT ---
        // This renders the admin/students.tsx page
        Route::get('/admin/students', [StudentController::class, 'index'])->name('admin.students');
        // This handles the form submission to create student + user
        Route::post('/admin/students', [StudentController::class, 'store'])->name('admin.students.store');

        // Document Request Management
        Route::post('/admin/requests/{docRequest}/status', [DocumentRequestController::class, 'updateStatus'])->name('admin.requests.update');

        // Test Route (keep if needed)
        Route::get('/admin/dashboard-test', function () {
            return Inertia::render('admin/test-dashboard', [
                'allRequests' => \App\Models\DocumentRequest::with(['user', 'documentType'])->latest()->get(),
                'stats' => [
                    'total' => \App\Models\DocumentRequest::count(),
                    'pending' => \App\Models\DocumentRequest::where('status', 'Pending')->count(),
                    'completed' => \App\Models\DocumentRequest::where('status', 'Completed')->count(),
                ]
            ]);
        })->name('admin.dashboard.test');
    });

    // --- STUDENT MODULE ---
    Route::get('/history', [DocumentRequestController::class, 'index'])->name('student.history');

    Route::get('/requests/create', function () {
        return Inertia::render('student/RequestForm', [
            'availableTypes' => DocumentType::all()
        ]);
    })->name('student.requests.create');

    Route::post('/requests', [DocumentRequestController::class, 'store'])->name('student.requests.store');
});

require __DIR__.'/settings.php';
