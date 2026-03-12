<?php

/**
 * @var \Tests\TestCase $this
 * @mixin \Illuminate\Foundation\Testing\Concerns\MakesHttpRequests
 */

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new students can register', function () {
    $response = $this->post(route('register'), [
        'first_name' => 'Test',
        'last_name' => 'User',
        'middle_name' => 'Q',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'student_id' => '2026-0001',
        'course' => 'BSCS',
        'year_level' => '1',
        'contact_number' => '09171234567',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    // make sure a student record was created for the new user
    $this->assertDatabaseHas('students', [
        'email' => 'test@example.com',
        'student_id' => '2026-0001',
    ]);
});
