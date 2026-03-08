<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    // List all students
    public function index()
    {
        return Inertia::render('admin/students', [
            'students' => Student::with('user')->latest()->get()
        ]);
    }

    // Show the "Add Student" form
    public function create()
    {
        return Inertia::render('admin/students/create');
    }

    // Process the registration
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'middle_name'    => 'nullable|string|max:255',
            'email'          => 'required|email|unique:users,email', // Important: unique in users
            'student_id'     => 'required|string|unique:students,student_id',
            'course'         => 'required|string',
            'year_level'     => 'required|string',
            'section'        => 'nullable|string',
            'contact_number' => 'nullable|string',
        ]);

        // When we create the Student, the "booted" method in
        // the Student Model automatically creates the User account.
        Student::create($validated);

        return redirect()->route('admin.students.students')
            ->with('message', 'Student and User account created successfully!');
    }
}
