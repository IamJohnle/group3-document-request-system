<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
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

        // Prevent creating a second student account for the same full name.
        // We compare case-insensitively and ignore leading/trailing whitespace.
        $firstName = Str::lower(trim($input['first_name']));
        $lastName = Str::lower(trim($input['last_name']));
        $middleName = trim($input['middle_name'] ?? '');

        $nameMatchQuery = \App\Models\Student::whereRaw('LOWER(first_name) = ?', [$firstName])
            ->whereRaw('LOWER(last_name) = ?', [$lastName]);

        if ($middleName !== '') {
            $nameMatchQuery->whereRaw('LOWER(middle_name) = ?', [Str::lower($middleName)]);
        } else {
            $nameMatchQuery->whereNull('middle_name');
        }

        if ($nameMatchQuery->exists()) {
            throw ValidationException::withMessages([
                'first_name' => __('A student with that full name already exists.'),
            ]);
        }

        // create the user record first
        try {
            $user = User::create([
                'name' => $input['first_name'] . ' ' . $input['last_name'],
                'email' => $input['email'],
                'password' => $input['password'],
            ]);
        } catch (QueryException $e) {
            // Convert unique constraint violations into a validation error so
            // Fortify can display a friendly message instead of a stack trace.
            if ($e->errorInfo[1] === 1062) {
                throw ValidationException::withMessages([
                    'email' => __('The email has already been taken.'),
                ]);
            }

            throw $e;
        }

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
