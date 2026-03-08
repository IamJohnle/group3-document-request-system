<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'middle_name',
        'email',
        'contact_number',
        'birth_date',
        'gender',
        'address',
        'student_id',
        'course',
        'year_level',
        'section',
        'enrollment_date',
        'is_active',
    ];

    protected static function booted()
    {
        static::creating(function ($student) {
            // 1. Create the User record
            // We combine first and last name for the User 'name' field
            $user = User::create([
                'name'     => $student->first_name . ' ' . $student->last_name,
                'email'    => $student->email,
                'password' => Hash::make('password123'), // Set a default or use Str::random(12)
                'role'     => 'student',
            ]);

            // 2. Link the new User's ID to this Student
            $student->user_id = $user->id;
        });
    }

    // Relationship: Access the User account from the Student model
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
