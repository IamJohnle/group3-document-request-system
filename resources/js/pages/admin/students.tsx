import { Head, useForm, router } from '@inertiajs/react';
import { Eye, X } from 'lucide-react';
import React, { useState, } from 'react';
import AppSidebarLayout from '../../layouts/app/app-sidebar-layout';

interface Student {
    id: number;
    student_id: string;
    first_name: string;
    last_name: string;
    email: string;
    course: string;
    year_level: string;
    section?: string;
    contact_number?: string;
    street?: string;
    barangay?: string;
    municipality?: string;
    province?: string;
}

interface Props {
    students: Student[];
}

export default function Students({ students }: Props) {
            const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
        const handleDelete = (student: Student) => {
            if (window.confirm(`Are you sure you want to delete student ${student.first_name} ${student.last_name}?`)) {
                router.delete(route('admin.students.destroy', student.id));
            }
        };
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    // Helper to get submitted documents for selected student
    const getSubmittedDocuments = (student: any) => {
        if (!student.user || !student.user.requests) return [];
        return student.user.requests;
    };
    const [search, setSearch] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        middle_name: '',
        gender: '',
        birth_date: '',
        age: '',
        religion: '',
        contact_number: '',
        street: '',
        barangay: '',
        municipality: '',
        province: '',
        student_id: '',
        course: '',
        year_level: '',
        section: '',
        email: '',
        password: '',
        password_confirmation: '',
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
        setData('birth_date', birthdate);
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

    const breadcrumbs = [{ title: 'Students', href: '/admin/students' }];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Management" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Student Directory</h1>
                    <p className="text-sm text-gray-500">Manage and register students in the system.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-md font-medium"
                >
                    + Add New Student
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4 flex justify-end">
                <input
                    type="text"
                    className="w-full md:w-1/3 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search by name, ID, or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Registered Students</h2>
                            <p className="text-sm text-gray-500">Click “Details” to view more information.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                                {students.length} students
                            </span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID Number</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Program & Year</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {students
                                .filter(student => {
                                    const q = search.toLowerCase();
                                    return (
                                        student.student_id.toLowerCase().includes(q) ||
                                        student.first_name.toLowerCase().includes(q) ||
                                        student.last_name.toLowerCase().includes(q) ||
                                        student.email.toLowerCase().includes(q)
                                    );
                                })
                                .map((student) => (
                                    <tr key={student.id} className="hover:bg-indigo-50/40 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-indigo-600 font-medium">{student.student_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.first_name} {student.last_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.course} - {student.year_level}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right flex gap-2 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setShowDetailsModal(true);
                                                }}
                                                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 text-indigo-700 bg-white hover:bg-indigo-50 transition"
                                            >
                                                <Eye size={14} />
                                                Details
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(student)}
                                                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-red-200 text-red-700 bg-white hover:bg-red-50 transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowModal(false)}
                    />

                    <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Register New Student</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={submit} className="p-6 overflow-y-auto max-h-[75vh]">
                            {/* THE GRID CONTAINER STARTS HERE */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <div className="col-span-1 md:col-span-2">
                                    <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Academic Information</h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Student ID Number *</label>
                                    <input type="text" required placeholder="e.g. 2024-0001" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border"
                                        value={data.student_id} onChange={e => setData('student_id', e.target.value)} />
                                    {errors.student_id && <p className="text-red-500 text-xs mt-1">{errors.student_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Course *</label>
                                    <input type="text" required placeholder="e.g. BSCS" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border"
                                        value={data.course} onChange={e => setData('course', e.target.value)} />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Year Level *</label>
                                    <select required className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border"
                                        value={data.year_level} onChange={e => setData('year_level', e.target.value)}>
                                        <option value="">Select Year</option>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Section</label>
                                    <input type="text" placeholder="e.g. A" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border"
                                        value={data.section} onChange={e => setData('section', e.target.value)} />
                                </div>

                                <div className="col-span-1 md:col-span-2 mt-2">
                                    <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Personal Details</h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                                    <input type="text" required className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border"
                                        value={data.first_name} onChange={e => setData('first_name', e.target.value)} />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                                    <input type="text" required className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border"
                                        value={data.last_name} onChange={e => setData('last_name', e.target.value)} />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Birthdate *</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border"
                                        value={data.birth_date}
                                        onChange={handleBirthdateChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Gender *</label>
                                    <select
                                        required
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border"
                                        value={data.gender}
                                        onChange={e => setData('gender', e.target.value)}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                                    <input type="email" required placeholder="student@email.com" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border"
                                        value={data.email} onChange={e => setData('email', e.target.value)} />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
                                    <input type="password" required className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border"
                                        value={data.password} onChange={e => setData('password', e.target.value)} />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password *</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                    />
                                </div>

                            </div>
                            {/* THE GRID CONTAINER ENDS HERE */}

                            <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Complete Registration'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDetailsModal && selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowDetailsModal(false)}
                    />

                    <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Student Details</h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Student ID</p>
                                    <p className="text-sm font-medium text-gray-800">{selectedStudent.student_id}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</p>
                                    <p className="text-sm font-medium text-gray-800">{selectedStudent.first_name} {selectedStudent.last_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
                                    <p className="text-sm font-medium text-gray-800">{selectedStudent.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Program</p>
                                    <p className="text-sm font-medium text-gray-800">{selectedStudent.course} - {selectedStudent.year_level}</p>
                                </div>
                                {selectedStudent.section && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Section</p>
                                        <p className="text-sm font-medium text-gray-800">{selectedStudent.section}</p>
                                    </div>
                                )}
                                {selectedStudent.contact_number && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</p>
                                        <p className="text-sm font-medium text-gray-800">{selectedStudent.contact_number}</p>
                                    </div>
                                )}
                                {selectedStudent.street && (
                                    <div className="md:col-span-2">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Address</p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {selectedStudent.street}, {selectedStudent.barangay}, {selectedStudent.municipality}, {selectedStudent.province}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Submitted Documents */}
                            <div className="mt-6">
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Submitted Documents</p>
                                {getSubmittedDocuments(selectedStudent).length === 0 ? (
                                    <p className="text-sm text-gray-500">No documents submitted.</p>
                                ) : (
                                    <ul className="divide-y divide-gray-100">
                                        {getSubmittedDocuments(selectedStudent).map((doc: any) => (
                                            <li
                                                key={doc.id}
                                                className="py-2 flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer hover:bg-indigo-50/40 rounded"
                                                onClick={() => setSelectedDocument(doc)}
                                            >
                                                <span className="font-medium text-gray-800">
                                                    {doc.document_type?.name || doc.documentType?.name || 'Document'}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-1 md:mt-0">{doc.status ? doc.status : ''}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                                    {/* Document Image Modal */}
            {selectedDocument && (selectedDocument.attachment || selectedDocument.final_file) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedDocument(null)}
                    />
                    {/* Modal */}
                    <div className="relative w-full max-w-xl mx-auto rounded-2xl shadow-2xl border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/80">
                            <h2 className="text-lg font-bold text-gray-800">Document Image</h2>
                            <button
                                onClick={() => setSelectedDocument(null)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                                aria-label="Close document image modal"
                            >
                                <X size={22} />
                            </button>
                        </div>
                        <div className="p-6 flex flex-col items-center justify-center max-h-[75vh] overflow-y-auto bg-white/90">
                            <div className="w-full flex justify-center items-center rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-inner">
                                <img
                                    src={selectedDocument.attachment ? `/storage/${selectedDocument.attachment}` : `/storage/${selectedDocument.final_file}`}
                                    alt="Document"
                                    className="rounded-lg shadow max-h-[55vh] object-contain w-auto h-auto border border-gray-200"
                                    style={{ maxWidth: '100%', maxHeight: '55vh' }}
                                    onError={e => (e.currentTarget.style.display = 'none')}
                                />
                            </div>
                            <p className="mt-4 text-xs text-gray-500 break-all text-center w-full font-mono bg-gray-100 rounded p-2 border border-gray-200">{selectedDocument.attachment || selectedDocument.final_file}</p>
                        </div>
                    </div>
                </div>
            )}
                        </div>
                    </div>
                </div>
            )}
        </AppSidebarLayout>
    );
}
