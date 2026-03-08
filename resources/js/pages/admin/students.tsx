import { Head, useForm, } from '@inertiajs/react';
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

    const breadcrumbs = [
        { title: 'Students', href: '/admin/students' },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Management" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Students</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Add New Student
                </button>
            </div>

            {/* Student Table */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{student.student_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{student.first_name} {student.last_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{student.course}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{student.year_level}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Simple Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Register New Student</h2>
                        <form onSubmit={submit} className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input type="text" className="mt-1 block w-full border rounded-md p-2"
                                    value={data.first_name} onChange={e => setData('first_name', e.target.value)} />
                                {errors.first_name && <div className="text-red-500 text-xs">{errors.first_name}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input type="text" className="mt-1 block w-full border rounded-md p-2"
                                    value={data.last_name} onChange={e => setData('last_name', e.target.value)} />
                                {errors.last_name && <div className="text-red-500 text-xs">{errors.last_name}</div>}
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Email (Used for login)</label>
                                <input type="email" className="mt-1 block w-full border rounded-md p-2"
                                    value={data.email} onChange={e => setData('email', e.target.value)} />
                                {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Student ID No.</label>
                                <input type="text" className="mt-1 block w-full border rounded-md p-2"
                                    value={data.student_id} onChange={e => setData('student_id', e.target.value)} />
                                {errors.student_id && <div className="text-red-500 text-xs">{errors.student_id}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Course</label>
                                <input type="text" className="mt-1 block w-full border rounded-md p-2"
                                    value={data.course} onChange={e => setData('course', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Year Level</label>
                                <select className="mt-1 block w-full border rounded-md p-2"
                                    value={data.year_level} onChange={e => setData('year_level', e.target.value)}>
                                    <option value="">Select Year</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                            </div>

                            <div className="col-span-2 flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" disabled={processing} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                                    {processing ? 'Saving...' : 'Register Student'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppSidebarLayout>
    );
}
