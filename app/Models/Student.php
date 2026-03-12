<?php

namespace App\Models;

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
        'contact_number', 'birth_date', 'gender', 'address',
        'student_id', 'course', 'year_level', 'section', 'enrollment_date', 'is_active',
    ];

    protected static function booted()
    {
        static::creating(function ($student) {
            // Only auto-create a user when none has been provided. This
            // avoids accidentally making duplicate users when we manually
            // pass `user_id` (for example during Fortify registration).
            if (!$student->user_id) {
                $user = User::create([
                    'name'     => $student->first_name . ' ' . $student->last_name,
                    'email'    => $student->email,
                    // Use the password passed from the controller, or a default
                    'password' => Hash::make($student->password_from_form ?? 'password123'),
                    'role'     => 'student',
                ]);

                $student->user_id = $user->id;
            }
        });
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
