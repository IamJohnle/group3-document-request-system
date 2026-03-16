<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    // List all students
    public function index()
    {
        // page filename is now students.tsx so match casing
        return Inertia::render('admin/students', [
            'students' => Student::with(['user.requests.documentType'])->latest()->get()
        ]);
    }

    // Show the \"Add Student\" form
    public function create()
    {
        // subfolder for student pages is still lowercase but name of file is create.tsx
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

        // Do NOT log in the student if admin is creating
        return redirect()->route('admin.students.index')
            ->with('message', 'Student created successfully!');
    }

    // Show the edit form for a student
    public function edit(Student $student)
    {
        return Inertia::render('admin/students/edit', [
            'student' => $student->load('user')
        ]);
    }

    // Update student information
    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'middle_name'    => 'nullable|string|max:255',
            'email'          => 'required|email|unique:users,email,' . $student->user_id,
            'student_id'     => 'required|string|unique:students,student_id,' . $student->id,
            'course'         => 'required|string',
            'year_level'     => 'required|string',
            'section'        => 'nullable|string',
            'contact_number' => 'nullable|string',
            'street'         => 'nullable|string|max:255',
            'barangay'       => 'nullable|string|max:255',
            'municipality'   => 'nullable|string|max:255',
            'province'       => 'nullable|string|max:255',
            'birth_date'     => 'nullable|date',
            'gender'         => 'nullable|string|in:Male,Female,Other',
            'religion'       => 'nullable|string|max:255',
        ]);

        // Update student data
        $student->update($validated);

        // Update associated user data
        if ($student->user) {
            $student->user->update([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
            ]);
        }

        return redirect()->route('admin.students.index')
            ->with('message', 'Student updated successfully!');
    }

    // Delete a student
    public function destroy(Student $student)
    {
        // Delete the associated user first (cascade delete should handle this, but let's be explicit)
        if ($student->user) {
            $student->user->delete();
        }

        $student->delete();

        return redirect()->route('admin.students.index')
            ->with('message', 'Student deleted successfully!');
    }
}
