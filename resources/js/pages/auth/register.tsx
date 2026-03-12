import { useForm, Head } from '@inertiajs/react';
import React from 'react';
import type { FormEvent, ChangeEvent } from 'react';
// REMOVED: import { route } from 'ziggy-js';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

// Add this so TypeScript knows that 'route' exists globally via the @routes blade directive
declare const route: any;

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        student_id: '',
        course: '',
        year_level: '',
        contact_number: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        // Use 'register.store' as it is the official POST route name in your route:list
        post(route('register.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title="Student Registration"
            description="Enter your academic and personal details"
        >
            <Head title="Register" />

            <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                            id="first_name"
                            value={data.first_name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData('first_name', e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.first_name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="middle_name">Middle Name</Label>
                        <Input
                            id="middle_name"
                            value={data.middle_name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData('middle_name', e.target.value)
                            }
                        />
                        <InputError message={errors.middle_name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                            id="last_name"
                            value={data.last_name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData('last_name', e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.last_name} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="student_id">Student ID</Label>
                        <Input
                            id="student_id"
                            placeholder="2024-0001"
                            value={data.student_id}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData('student_id', e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.student_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="course">Course</Label>
                        <Input
                            id="course"
                            placeholder="BSIT"
                            value={data.course}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData('course', e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.course} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="year_level">Year Level</Label>
                        <Input
                            id="year_level"
                            placeholder="1"
                            value={data.year_level}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData('year_level', e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.year_level} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="contact_number">Contact Number</Label>
                        <Input
                            id="contact_number"
                            placeholder="09171234567"
                            value={data.contact_number}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData('contact_number', e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.contact_number} />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setData('email', e.target.value)
                        }
                        required
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData('password', e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.password} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="mt-2 w-full"
                    disabled={processing}
                >
                    {processing && <Spinner className="mr-2" />}
                    Register Student Account
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href="/login">Log in</TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
