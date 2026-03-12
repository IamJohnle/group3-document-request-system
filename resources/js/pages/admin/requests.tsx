// pages/admin/Requests.tsx
import { Head, Link, router } from '@inertiajs/react';
import {
    FileText,
    Eye,
    Edit,
    Trash2,
} from 'lucide-react';
import React from 'react';
import AppSidebarLayout from '../../layouts/app/app-sidebar-layout';

interface DocumentRequest {
    id: number;
    status: string;
    purpose: string;
    copies: number;
    user: { name: string; email?: string };
    document_type: { name: string };
    created_at: string;
}

interface RequestsProps {
    requests: DocumentRequest[];
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Requests', href: '/admin/requests' },
];

export default function Requests({ requests = [] }: RequestsProps) {
    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this request?')) return;
        router.delete(route('admin.requests.destroy', { docRequest: id }));
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Requests" />

            <div className="p-6 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FileText size={24} />
                    All Student Requests
                </h1>
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3">Student</th>
                                <th className="px-6 py-3">Document</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Submitted</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">
                                        {req.user.name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {req.document_type.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                                req.status === 'Completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : req.status === 'Pending'
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}
                                        >
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(req.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link
                                            href={route('admin.requests.show', {
                                                docRequest: req.id,
                                            })}
                                            className="text-indigo-600 hover:underline"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <Link
                                            href={route('admin.requests.edit', {
                                                docRequest: req.id,
                                            })}
                                            className="text-green-600 hover:underline"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(req.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
