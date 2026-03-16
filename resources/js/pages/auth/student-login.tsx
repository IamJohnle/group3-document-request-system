import { Head, useForm, Link } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import type { FormEvent, useState } from 'react';

interface StudentLoginProps {
    canResetPassword: boolean;
    canRegister: boolean;
    status?: string;
}

export default function StudentLogin({ canResetPassword, canRegister, status }: StudentLoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('login.store'));
    };

    return (
        <>
            <Head title="Student Login" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Student Portal</h1>
                            <p className="text-gray-600 mt-2">Sign in to request documents</p>
                        </div>

                        {status && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{status}</div>}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="student@university.edu"
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-green-600"
                                />
                                <label className="ml-2 text-sm text-gray-700">Remember me</label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition"
                            >
                                {processing ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-6 space-y-3">
                            {canResetPassword && (
                                <div className="text-center">
                                    <a href={route('password.request')} className="text-green-600 hover:text-green-700 text-sm">
                                        Forgot your password?
                                    </a>
                                </div>
                            )}

                            {canRegister && (
                                <div className="text-center">
                                    <p className="text-gray-700 text-sm">
                                        Don't have an account?{' '}
                                        <Link href={route('register')} className="text-green-600 hover:text-green-700 font-medium">
                                            Register here
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
