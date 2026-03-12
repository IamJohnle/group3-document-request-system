import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import AppSidebarLayout from '../../layouts/app/app-sidebar-layout';

interface Student {
    id: number;
    student_id: string;
    first_name: string;
    last_name: string;
    email: string;
    course: string;
    year_level: string;
}

interface Props {
    students: Student[];
}

export default function Students({ students }: Props) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
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
        post(route('admin.students.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const breadcrumbs = [{ title: 'Students', href: '/admin/students' }];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Management" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Students</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Add New Student
                </button>
            </div>

            {/* Student Table */}
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Course
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Year
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {student.student_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {student.first_name} {student.last_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {student.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {student.course}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {student.year_level}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Simple Modal Form */}
            {showModal && (
                <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
                        <h2 className="mb-4 text-xl font-bold">
                            Register New Student
                        </h2>
                        <form
                            onSubmit={submit}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border p-2"
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData('first_name', e.target.value)
                                    }
                                />
                                {errors.first_name && (
                                    <div className="text-xs text-red-500">
                                        {errors.first_name}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border p-2"
                                    value={data.last_name}
                                    onChange={(e) =>
                                        setData('last_name', e.target.value)
                                    }
                                />
                                {errors.last_name && (
                                    <div className="text-xs text-red-500">
                                        {errors.last_name}
                                    </div>
                                )}
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Email (Used for login)
                                </label>
                                <input
                                    type="email"
                                    className="mt-1 block w-full rounded-md border p-2"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <div className="text-xs text-red-500">
                                        {errors.email}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Student ID No.
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border p-2"
                                    value={data.student_id}
                                    onChange={(e) =>
                                        setData('student_id', e.target.value)
                                    }
                                />
                                {errors.student_id && (
                                    <div className="text-xs text-red-500">
                                        {errors.student_id}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Course
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border p-2"
                                    value={data.course}
                                    onChange={(e) =>
                                        setData('course', e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Year Level
                                </label>
                                <select
                                    className="mt-1 block w-full rounded-md border p-2"
                                    value={data.year_level}
                                    onChange={(e) =>
                                        setData('year_level', e.target.value)
                                    }
                                >
                                    <option value="">Select Year</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                            </div>

                            <div className="col-span-2 mt-4 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-white"
                                >
                                    {processing
                                        ? 'Saving...'
                                        : 'Register Student'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppSidebarLayout>
    );
}
