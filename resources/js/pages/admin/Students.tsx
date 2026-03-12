import { Head, router } from '@inertiajs/react';
import React from 'react';
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
    // we now navigate to a dedicated page for creating a student instead of
    // rendering a modal.  keeping breadcrumbs for the list.
    const breadcrumbs = [{ title: 'Students', href: '/admin/students' }];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Management" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Students</h1>
                <button
                    onClick={() => router.get('/admin/students/create')}
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
        </AppSidebarLayout>
    );
}
