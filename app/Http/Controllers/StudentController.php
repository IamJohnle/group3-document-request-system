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

   public function store(Request $request)
        {
            $validated = $request->validate([
                'first_name'     => 'required|string|max:255',
                'last_name'      => 'required|string|max:255',
                'middle_name'    => 'nullable|string|max:255',
                'email'          => 'required|email|unique:users,email',
                'password'       => 'required|string|min:8|confirmed',
                'student_id'     => 'required|string|unique:students,student_id',
                'course'         => 'required|string',
                'year_level'     => 'required|string',
                'section'        => 'nullable|string',
                'contact_number' => 'nullable|string',
            ]);

            // Create a new student instance but don't save yet
            $student = new Student($validated);

            // Pass the password to the model so the "booted" method can see it
            $student->password_from_form = $request->password;

            $student->save();

            return redirect()->route('login') // Redirect to login after registration
                ->with('message', 'Registration successful! Please log in.');
        }
}
