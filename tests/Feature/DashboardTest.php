<?php

/**
 * @property \App\Models\User $student
 * @property \App\Models\User $admin
 */

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

beforeEach(function () {
    // create a default user (student) and an admin user
    $this->student = User::factory()->create(['role' => 'student']);
    $this->admin   = User::factory()->create(['role' => 'admin']);
});

it('redirects admin users to the admin dashboard', function () {
    $response = $this->actingAs($this->admin)->get(route('dashboard'));
    $response->assertRedirect(route('admin.dashboard'));
});

it('allows a student to view the dashboard page', function () {
    $response = $this->actingAs($this->student)->get(route('dashboard'));
    $response->assertOk();
});

it('requires authentication to access the dashboard', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});
