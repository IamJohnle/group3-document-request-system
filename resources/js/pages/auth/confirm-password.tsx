import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

export default function ConfirmPassword() {
    // 1. Initialize the standard Inertia form hook
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    // 2. Handle the form submission
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // This hits the standard Laravel password confirmation route
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Confirm your password"
            description="This is a secure area of the application. Please confirm your password before continuing."
        >
            <Head title="Confirm Password" />

            {/* 3. Use standard HTML form with submit handler */}
            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        autoFocus
                        placeholder="Enter your password"
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="flex items-center justify-end">
                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing && <Spinner />}
                        Confirm
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}