import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    FileText,
    Filter,
    MoreVertical,
    Search,
    TrendingUp,
} from 'lucide-react';
import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';

// 1. Types
interface DocumentRequest {
    id: number;
    status: string;
    purpose: string;
    copies: number;
    user: {
        name: string;
        email?: string;
    };
    documentType: {
        name: string;
    };
}

interface RequestsProps {
    requests: DocumentRequest[];
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Document Requests', href: '/admin/requests' },
];

const Requests = ({ requests }: RequestsProps) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleUpdateStatus = (id: number, newStatus: string) => {
        if (confirm(`Change status to ${newStatus}?`)) {
            router.post(`/admin/requests/${id}/status`, {
                status: newStatus
            }, {
                preserveScroll: true
            });
        }
    };

    const filteredRequests = requests.filter((req) =>
        req.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.documentType.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Count requests by status
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'Pending').length,
        processing: requests.filter(r => r.status === 'Processing').length,
        completed: requests.filter(r => r.status === 'Completed').length,
        rejected: requests.filter(r => r.status === 'Rejected').length,
    };

    const statCards = [
        { label: 'Total Requests', value: stats.total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
        { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
        { label: 'Processing', value: stats.processing, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
        { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Document Requests" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Document Requests</h1>
                        <p className="text-muted-foreground text-sm">Manage and process student document requests.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat, index) => (
                        <div key={index} className={`p-6 rounded-xl border shadow-sm flex items-center gap-4 bg-white`}>
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="font-semibold">All Requests</h2>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search student or document..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 pr-3 py-1.5 border rounded-md text-sm focus:ring-2 focus:ring-ring outline-none w-full sm:w-64"
                                />
                            </div>
                            <button className="p-2 border rounded-md hover:bg-gray-50 text-muted-foreground" title="Filter">
                                <Filter size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 text-xs font-medium text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-6 py-3 border-b">Student</th>
                                    <th className="px-6 py-3 border-b">Document</th>
                                    <th className="px-6 py-3 border-b">Purpose</th>
                                    <th className="px-6 py-3 border-b">Copies</th>
                                    <th className="px-6 py-3 border-b">Status</th>
                                    <th className="px-6 py-3 border-b text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium">{req.user.name}</td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {req.documentType.name}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                <span className="truncate max-w-[150px] inline-block">{req.purpose}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {req.copies}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                    req.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    req.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    req.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    req.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    'bg-gray-50 text-gray-700 border-gray-100'
                                                }`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <select
                                                        className="text-xs bg-transparent border rounded p-1 outline-none focus:ring-1 focus:ring-ring"
                                                        value={req.status}
                                                        onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                                                        aria-label="Update request status"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="Rejected">Rejected</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                                            No requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
};

export default Requests;
