<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
{
    $user = $request->user();

    // Debugging: If you still can't get in, uncomment the next line to see what role you have
    // dd($user->role);

    if ($user && $user->role === 'admin') {
        return $next($request);
    }

    // If not admin, send them to the student dashboard with an error
    return redirect('/dashboard')->with('error', 'Unauthorized access.');
}
}
