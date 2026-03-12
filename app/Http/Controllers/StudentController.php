<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
            'gender'         => 'required|string|in:male,female,other',
            'birthdate'      => 'required|date',
            'street'         => 'required|string|max:255',
            'barangay'       => 'required|string|max:255',
            'municipality'   => 'required|string|max:255',
            'province'       => 'required|string|max:255',
            'religion'       => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:50',
            'email'          => 'required|email|unique:users,email',
            'password'       => 'required|string|min:6',
        ]);

        // map form keys to database columns
        $studentData = $validated;
        $studentData['birth_date'] = $studentData['birthdate'];
        unset($studentData['birthdate']);

        // address parts are stored directly, no concatenation needed

        // remove password from student data, but keep it temporarily for user creation
        $password = $studentData['password'];
        unset($studentData['password']);

        // create user first so we control the password
        $user = User::create([
            'name'     => $studentData['first_name'] . ' ' . $studentData['last_name'],
            'email'    => $studentData['email'],
            'password' => Hash::make($password),
            'role'     => 'student',
        ]);

        $studentData['user_id'] = $user->id;

        Student::create($studentData);

        return redirect()->route('admin.students')
            ->with('message', 'Student and User account created successfully!');
    }
}
