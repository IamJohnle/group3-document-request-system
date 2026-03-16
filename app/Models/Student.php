<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Hash;


class Student extends Model
{
    use HasFactory;

    // We add a virtual property to hold the password temporarily
    public $password_from_form;

    protected $fillable = [
        'user_id', 'first_name', 'last_name', 'middle_name', 'email',
        'contact_number', 'birth_date', 'gender', 'religion',
        'address', 'street', 'barangay', 'municipality', 'province',
        'student_id', 'course', 'year_level', 'section', 'enrollment_date', 'is_active',
    ];

    // Inside App\Models\Student.php
        protected static function booted()
        {
            static::created(function ($student) {
                $user = User::where('email', $student->email)->first();

                if (!$user) {
                    $user = User::create([
                        'name' => $student->first_name . ' ' . $student->last_name,
                        'email' => $student->email, // This assumes email is in the validated data
                        'password' => Hash::make($student->password_from_form),
                        'role' => 'student', // <--- MAKE SURE THIS LINE EXISTS
                    ]);
                }

                $student->update(['user_id' => $user->id]);
            });
        }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
