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
import AppSidebarLayout from '../../layouts/app/app-sidebar-layout';// Adjust path if necessary

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
    document_type: {
        name: string;
    };
}

interface DashboardProps {
    allRequests: DocumentRequest[];
    stats: {
        total: number;
        pending: number;
        completed: number;
    };
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
];

const Dashboard = ({ allRequests, stats }: DashboardProps) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Derived Stats
    const rejectedCount = allRequests.filter((r) => r.status === 'Rejected').length;
    const processingRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    const statCards = [
        { label: 'Total Requests', value: stats.total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
        { label: 'Pending Approval', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
        { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
        { label: 'Rejected', value: rejectedCount, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
    ];

    const handleUpdateStatus = (id: number, newStatus: string) => {
        if (confirm(`Change status to ${newStatus}?`)) {
            router.post(`/admin/requests/${id}/status`, {
                status: newStatus
            }, {
                preserveScroll: true
            });
        }
    };

    const filteredRequests = allRequests.filter((req) =>
        req.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.document_type.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground text-sm">Overview of document processing and student requests.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
                            <TrendingUp size={16} /> Reports
                        </button>
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Table Section */}
                    <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="font-semibold">Recent Requests</h2>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search student..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8 pr-3 py-1.5 border rounded-md text-sm focus:ring-2 focus:ring-ring outline-none w-full sm:w-64"
                                    />
                                </div>
                                <button className="p-2 border rounded-md hover:bg-gray-50 text-muted-foreground">
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
                                                    {req.document_type.name}
                                                    <span className="block text-xs text-gray-400">{req.copies} copies</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                        req.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' :
                                                        req.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                        req.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                        'bg-red-50 text-red-700 border-red-100'
                                                    }`}>
                                                        {req.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <select
                                                            className="text-xs bg-transparent border rounded p-1 outline-none focus:ring-1 focus:ring-ring"
                                                            value={req.status}
                                                            onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Processing">Processing</option>
                                                            <option value="Completed">Completed</option>
                                                            <option value="Rejected">Rejected</option>
                                                        </select>
                                                        <button className="text-muted-foreground hover:text-foreground">
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                                                No requests found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Analytics / Sidebar Section */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border shadow-sm p-5 space-y-6">
                            <h2 className="font-semibold">Request Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Overall Completion Rate</span>
                                    <span className="font-bold">{processingRate}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${processingRate}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <div className="flex gap-3">
                                        <AlertCircle className="text-blue-600 shrink-0" size={18} />
                                        <div>
                                            <p className="text-sm font-semibold text-blue-900">Attention Required</p>
                                            <p className="text-xs text-blue-700 mt-1">
                                                There are {stats.pending} pending requests waiting for your approval.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
};

export default Dashboard;
