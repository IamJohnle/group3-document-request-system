<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

// ensure admin dashboard route works and returns expected data
test('admins can access the admin dashboard', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $response = $this->get(route('admin.dashboard'));
    $response->assertOk();
    // we expect an Inertia response with the correct component name
    $response->assertInertia(fn ($page) =>
        $page->component('admin/dashboard')
            ->has('allRequests')
            ->has('stats')
    );
});