<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        // validation rules are now expanded to include the student-specific
        // fields that our front-end form sends. We also compute the full
        // "name" from first/last values instead of expecting it directly.
        Validator::make($input, [
            'first_name'     => ['required', 'string', 'max:255'],
            'last_name'      => ['required', 'string', 'max:255'],
            'middle_name'    => ['nullable', 'string', 'max:255'],
            'email'          => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'       => $this->passwordRules(),
            'student_id'     => ['required', 'string', 'unique:students,student_id'],
            'course'         => ['required', 'string'],
            'year_level'     => ['required', 'string'],
            'contact_number' => ['nullable', 'string'],
        ])->validate();

        // create the user record first
        $user = User::create([
            'name' => $input['first_name'] . ' ' . $input['last_name'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);

        // then create a student record attached to the new user
        // the student model boot method will *not* create another user, thanks to
        // the guard we added earlier (it checks for an existing user_id).

        \App\Models\Student::create([
            'user_id'        => $user->id,
            'first_name'     => $input['first_name'],
            'last_name'      => $input['last_name'],
            'middle_name'    => $input['middle_name'] ?? null,
            'email'          => $input['email'],
            'student_id'     => $input['student_id'],
            'course'         => $input['course'],
            'year_level'     => $input['year_level'],
            'contact_number' => $input['contact_number'] ?? null,
        ]);

        return $user;
    }
}
