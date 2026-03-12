import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import AppSidebarLayout from '../../../layouts/app/app-sidebar-layout';

interface FormData {
    first_name: string;
    last_name: string;
    middle_name: string;
    email: string;
    student_id: string;
    course: string;
    year_level: string;
    section: string;
    contact_number: string;
}

export default function CreateStudent() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        student_id: '',
        course: '',
        year_level: '',
        section: '',
        contact_number: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.students.store'));
    };

    const breadcrumbs = [
        { title: 'Students', href: '/admin/students' },
        { title: 'Add Student', href: '/admin/students/create' },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Student" />

            <h1 className="text-2xl font-bold mb-4">Register New Student</h1>

            <form onSubmit={submit} className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">First Name</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border p-2"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                    />
                    {errors.first_name && (
                        <div className="text-xs text-red-500">
                            {errors.first_name}
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">Last Name</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border p-2"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                    />
                    {errors.last_name && (
                        <div className="text-xs text-red-500">
                            {errors.last_name}
                        </div>
                    )}
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium">
                        Email (Used for login)
                    </label>
                    <input
                        type="email"
                        className="mt-1 block w-full rounded-md border p-2"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && (
                        <div className="text-xs text-red-500">
                            {errors.email}
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">Student ID</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border p-2"
                        value={data.student_id}
                        onChange={(e) => setData('student_id', e.target.value)}
                    />
                    {errors.student_id && (
                        <div className="text-xs text-red-500">
                            {errors.student_id}
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">Course</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border p-2"
                        value={data.course}
                        onChange={(e) => setData('course', e.target.value)}
                    />
                    {errors.course && (
                        <div className="text-xs text-red-500">
                            {errors.course}
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">Year Level</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border p-2"
                        value={data.year_level}
                        onChange={(e) => setData('year_level', e.target.value)}
                    />
                    {errors.year_level && (
                        <div className="text-xs text-red-500">
                            {errors.year_level}
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">Section</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border p-2"
                        value={data.section}
                        onChange={(e) => setData('section', e.target.value)}
                    />
                    {errors.section && (
                        <div className="text-xs text-red-500">
                            {errors.section}
                        </div>
                    )}
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium">
                        Contact Number
                    </label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border p-2"
                        value={data.contact_number}
                        onChange={(e) =>
                            setData('contact_number', e.target.value)
                        }
                    />
                    {errors.contact_number && (
                        <div className="text-xs text-red-500">
                            {errors.contact_number}
                        </div>
                    )}
                </div>

                <div className="col-span-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        Register
                    </button>
                </div>
            </form>
        </AppSidebarLayout>
    );
}
