<?php

/**
 * @var \Tests\TestCase $this
 * @mixin \Illuminate\Foundation\Testing\Concerns\MakesHttpRequests
 */

test('returns a successful response', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
});
