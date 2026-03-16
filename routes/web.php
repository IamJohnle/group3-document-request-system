<?php

use App\Http\Controllers\StudentController;
use App\Http\Controllers\Admin\RequestController as AdminRequestController;
use App\Http\Controllers\Student\RequestController as StudentRequestController;
use App\Http\Controllers\DocumentTypeController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| 1. PUBLIC ROUTES
|--------------------------------------------------------------------------
*/
Route::get('/', fn() => Inertia::render('welcome', ['canRegister' => true]))->name('home');

// Separate login pages
Route::get('/admin/login', fn() => Inertia::render('auth/admin-login', [
    'canResetPassword' => true,
    'canRegister' => false,
    'status' => session('status'),
]))->name('admin.login');

Route::get('/student/login', fn() => Inertia::render('auth/student-login', [
    'canResetPassword' => true,
    'canRegister' => true,
    'status' => session('status'),
]))->name('student.login');


/*
|--------------------------------------------------------------------------
| 2. PROTECTED ROUTES (Must be logged in)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    /**
     * DASHBOARD TRAFFIC COP
     * Sends Admin to Admin Dashboard, Students to Student Dashboard
     */
    Route::get('/dashboard', function () {
        return Auth::user()->role === 'admin'
            ? redirect()->route('admin.dashboard')
            : app(StudentRequestController::class)->dashboard(request());
    })->name('dashboard');

    // --- ADMIN MODULE ---
    Route::middleware([AdminMiddleware::class])
        ->prefix('admin')
        ->name('admin.')
        ->group(function () {

            // Dashboard & Reports
            Route::get('/dashboard', [AdminRequestController::class, 'dashboard'])->name('dashboard');
            Route::get('/reports', [AdminRequestController::class, 'reports'])->name('reports');

            // Request Management
            Route::resource('requests', AdminRequestController::class)
                ->only(['index', 'show', 'edit', 'update', 'destroy'])
                ->parameters(['requests' => 'documentRequest']); // Standardized parameter naming

            // Custom Status Update (used by the dashboard toggle)
            Route::post('requests/{documentRequest}/status', [AdminRequestController::class, 'updateStatus'])->name('requests.status');

            // Document Type Management
            Route::resource('document-types', DocumentTypeController::class)->except(['show', 'create', 'edit']);

            // Student Management
            Route::resource('students', StudentController::class);
    });

    // --- STUDENT MODULE ---
    Route::prefix('student')->name('student.')->group(function () {
        // Main Student Views
        Route::get('/dashboard', [StudentRequestController::class, 'dashboard'])->name('dashboard');
        Route::get('/history', [StudentRequestController::class, 'history'])->name('history');
        Route::get('/information', [StudentRequestController::class, 'information'])->name('information');
        Route::put('/information', [StudentRequestController::class, 'updateInformation'])->name('information.update');
        
        // Student Request Resource
        Route::resource('requests', StudentRequestController::class)
            ->only(['index', 'show', 'create', 'store'])
            ->parameters(['requests' => 'documentRequest']); // Matches $documentRequest in Controller
    });
});

/*
|--------------------------------------------------------------------------
| 3. SETTINGS ROUTES (Standard Laravel)
|--------------------------------------------------------------------------
*/
require __DIR__.'/settings.php';