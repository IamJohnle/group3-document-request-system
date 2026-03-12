<?php

use App\Http\Controllers\StudentController;
use App\Http\Controllers\DocumentRequestController;
use App\Http\Middleware\AdminMiddleware;
use App\Models\DocumentType;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. PUBLIC ROUTE
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => true,
    ]);
})->name('home');

// Convenience aliases for development
Route::get('/admin/login', fn() => redirect()->route('login'))->name('admin.login');
Route::get('/student/login', fn() => redirect()->route('login'))->name('student.login');

// 2. PROTECTED ROUTES (Must be logged in)
Route::middleware(['auth', 'verified'])->group(function () {

    /**
     * DASHBOARD TRAFFIC COP
     * This checks the user role. If admin, sends to Admin Dashboard.
     * If student, calls the controller to show Student Dashboard.
     */
    Route::get('/dashboard', function () {
        $user = Auth::user();
        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        return app(DocumentRequestController::class)->dashboard(request());
    })->name('dashboard');

    // --- ADMIN MODULE ---
    Route::middleware([AdminMiddleware::class])->group(function () {

        // Admin Dashboard & Reports
        Route::get('/admin/dashboard', [DocumentRequestController::class, 'adminIndex'])->name('admin.dashboard');

        // full request management (separate from dashboard summary)
        Route::get('/admin/requests', [DocumentRequestController::class, 'adminRequests'])->name('admin.requests.index');
        Route::get('/admin/requests/{docRequest}', [DocumentRequestController::class, 'adminShow'])->name('admin.requests.show');
        Route::get('/admin/requests/{docRequest}/edit', [DocumentRequestController::class, 'adminEdit'])->name('admin.requests.edit');
        Route::put('/admin/requests/{docRequest}', [DocumentRequestController::class, 'adminUpdate'])->name('admin.requests.update');
        Route::delete('/admin/requests/{docRequest}', [DocumentRequestController::class, 'adminDestroy'])->name('admin.requests.destroy');

        Route::get('/admin/reports', [DocumentRequestController::class, 'reportsIndex'])->name('admin.reports');

        // Document Type Management (Full CRUD in DocumentRequestController)
        Route::get('/admin/document-types', [DocumentRequestController::class, 'documentTypes'])->name('admin.document-types.index');
        Route::post('/admin/document-types', [DocumentRequestController::class, 'storeType'])->name('admin.document-types.store');
        Route::put('/admin/document-types/{id}', [DocumentRequestController::class, 'updateType'])->name('admin.document-types.update');
        Route::delete('/admin/document-types/{id}', [DocumentRequestController::class, 'destroyType'])->name('admin.document-types.destroy');

        // Student Management
        Route::get('/admin/students', [StudentController::class, 'index'])->name('admin.students');
        // form page for adding a new student
        Route::get('/admin/students/create', [StudentController::class, 'create'])->name('admin.students.create');
        Route::post('/admin/students', [StudentController::class, 'store'])->name('admin.students.store');

        // Request Management
        // give the status update route its own name so it doesn't collide
        // with the regular request update route.  The dashboard used a
        // hard‑coded URL but we'll switch it to use the named route too.
        Route::post('/admin/requests/{docRequest}/status', [DocumentRequestController::class, 'updateStatus'])
            ->name('admin.requests.status');
    });

    // --- STUDENT MODULE ---
    Route::get('/history', [DocumentRequestController::class, 'index'])->name('student.history');
    Route::get('/requests/create', [DocumentRequestController::class, 'create'])->name('student.requests.create');
    Route::post('/requests', [DocumentRequestController::class, 'store'])->name('student.requests.store');
});

require __DIR__.'/settings.php';
