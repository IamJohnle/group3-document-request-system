import { Head } from '@inertiajs/react';
import React from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';

interface DocumentRequest {
    id: number;
    status: string;
    created_at: string;
    user: { name: string };
    documentType: { name: string };
}

interface ReportsProps {
    requests?: DocumentRequest[];
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Reports', href: '/admin/reports' },
];

export default function Reports({ requests = [] }: ReportsProps) {
    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Reports</h1>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {requests.map((req) => (
                            <tr key={req.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{req.user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{req.documentType.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{req.status}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(req.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppSidebarLayout>
    );
}
