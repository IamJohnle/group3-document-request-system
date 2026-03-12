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
        'street',
        'barangay',
        'municipality',
        'province',
        'religion',
        'enrollment_date',
        'is_active',
    ];

    protected static function booted()
    {
        static::creating(function ($student) {
            // only create a User if one hasn't been linked yet
            if (!$student->user_id) {
                // 1. Create the User record
                // We combine first and last name for the User 'name' field
                $userData = [
                    'name'  => $student->first_name . ' ' . $student->last_name,
                    'email' => $student->email,
                    'role'  => 'student',
                ];

                // if the student model has a temporary password attribute (not persisted)
                if (isset($student->password)) {
                    $userData['password'] = Hash::make($student->password);
                } else {
                    $userData['password'] = Hash::make('password123');
                }

                $user = User::create($userData);

                // 2. Link the new User's ID to this Student
                $student->user_id = $user->id;
            }
        });
    }

    // Relationship: Access the User account from the Student model
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
