import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';;

interface AdminLoginProps {
    canResetPassword: boolean;
    status?: string;
}

export default function AdminLogin({ canResetPassword, status }: AdminLoginProps) {
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
            <Head title="Admin Login" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
                            <p className="text-gray-600 mt-2">Sign in to your admin account</p>
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="admin@example.com"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="h-4 w-4 text-blue-600"
                                />
                                <label className="ml-2 text-sm text-gray-700">Remember me</label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
                            >
                                {processing ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        {canResetPassword && (
                            <div className="mt-4 text-center">
                                <a href={route('password.request')} className="text-blue-600 hover:text-blue-700 text-sm">
                                    Forgot your password?
                                </a>
                            </div>
                        )}
                    </div>

                    <p className="text-center text-gray-600 text-sm mt-6">
                        Admin access only. Unauthorized access is prohibited.
                    </p>
                </div>
            </div>
        </>
    );
}
