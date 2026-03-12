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
    street?: string;
    barangay?: string;
    municipality?: string;
    province?: string;
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
        gender: '',
        birthdate: '',
        age: '',
        street: '',
        barangay: '',
        municipality: '',
        province: '',
        religion: '',
        contact_number: '',
        email: '',
        password: '',
    });

    const calculateAge = (birthdate: string) => {
        if (!birthdate) return '';
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age.toString();
    };

    const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const birthdate = e.target.value;
        setData('birthdate', birthdate);
        setData('age', calculateAge(birthdate));
    };

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
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{student.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{student.first_name} {student.last_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
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
                            {/* Name fields */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={data.first_name}
                                    onChange={e => setData('first_name', e.target.value)}
                                />
                                {errors.first_name && <div className="text-red-500 text-xs">{errors.first_name}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={data.middle_name}
                                    onChange={e => setData('middle_name', e.target.value)}
                                />
                                {errors.middle_name && <div className="text-red-500 text-xs">{errors.middle_name}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={data.last_name}
                                    onChange={e => setData('last_name', e.target.value)}
                                />
                                {errors.last_name && <div className="text-red-500 text-xs">{errors.last_name}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Gender *</label>
                                <select
                                    required
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={data.gender}
                                    onChange={e => setData('gender', e.target.value)}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && <div className="text-red-500 text-xs">{errors.gender}</div>}
                            </div>

                            {/* Birthdate / Age */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Birthdate *</label>
                                <input
                                    type="date"
                                    required
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={data.birthdate}
                                    onChange={handleBirthdateChange}
                                />
                                {errors.birthdate && <div className="text-red-500 text-xs">{errors.birthdate}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Age</label>
                                <input
                                    type="text"
                                    disabled
                                    className="mt-1 block w-full border rounded-md p-2 bg-gray-100"
                                    value={data.age}
                                />
                            </div>

                            {/* Address fields */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Street *</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={data.street}
                                    onChange={e => setData('street', e.target.value)}
                                />
                                {errors.street && <div className="text-red-500 text-xs">{errors.street}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Barangay *</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={data.barangay}
                                    onChange={e => setData('barangay', e.target.value)}
                                />
                                {errors.barangay && <div className="text-red-500 text-xs">{errors.barangay}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Municipality *</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={data.municipality}
                                    onChange={e => setData('municipality', e.target.value)}
                                />
                                {errors.municipality && <div className="text-red-500 text-xs">{errors.municipality}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Province *</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={data.province}
                                    onChange={e => setData('province', e.target.value)}
                                />
                                {errors.province && <div className="text-red-500 text-xs">{errors.province}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Religion</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={data.religion}
                                    onChange={e => setData('religion', e.target.value)}
                                />
                                {errors.religion && <div className="text-red-500 text-xs">{errors.religion}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={data.contact_number}
                                    onChange={e => setData('contact_number', e.target.value)}
                                />
                                {errors.contact_number && <div className="text-red-500 text-xs">{errors.contact_number}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                                {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password *</label>
                                <input
                                    type="password"
                                    required
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                />
                                {errors.password && <div className="text-red-500 text-xs">{errors.password}</div>}
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
