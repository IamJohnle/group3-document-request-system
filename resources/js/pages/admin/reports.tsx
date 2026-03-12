import { Head } from '@inertiajs/react';
import {
    BarChart3,
    CheckCircle,
    Clock,
    Download,
    FileText,
    Image as ImageIcon,
    Info,
    Search,
    User
} from 'lucide-react';
import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import type{ BreadcrumbItem } from '@/types';

interface DocumentRequest {
    id: number;
    status: 'Pending' | 'Approved' | 'Processing' | 'Completed' | 'Rejected';
    created_at: string;
    file_path?: string; // Replace with your actual database column name for the document image
    user: {
        name: string;
    };
    document_type: {
        name: string;
    };
}

interface ReportsProps {
    requests: DocumentRequest[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Reports', href: '/admin/reports' },
];

export default function Reports({ requests = [] }: ReportsProps) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filtering logic for the table
    const filteredRequests = requests.filter(req =>
        req.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.document_type?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats for the Right Sidebar
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'Pending').length,
        completed: requests.filter(r => r.status === 'Completed').length,
        processing: requests.filter(r => r.status === 'Processing').length,
        rejected: requests.filter(r => r.status === 'Rejected').length,
    };

    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />

            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        <FileText size={24} />
                        Document Submissions
                    </h1>
                        <p className="text-muted-foreground text-sm">View student uploads and request analytics.</p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-shadow">
                        <Download size={16} /> Export Report
                    </button>
                </div>

                {/* Main 12-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT SIDE: Student Table (8 Columns) */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
                                <h2 className="font-semibold text-gray-700">Submissions</h2>
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search student or document..."
                                        className="pl-9 pr-4 py-1.5 border rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 text-[11px] uppercase font-bold text-gray-500 tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3 border-b">Student Name</th>
                                            <th className="px-6 py-3 border-b">Document Requested</th>
                                            <th className="px-6 py-3 border-b text-center">Attachment</th>
                                            <th className="px-6 py-3 border-b">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-sm">
                                        {filteredRequests.map((req) => (
                                            <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                                                        <User size={14} />
                                                    </div>
                                                    <span className="font-medium text-gray-900">{req.user?.name}</span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{req.document_type?.name}</td>
                                                <td className="px-6 py-4 text-center">
                                                    {/* HOVER PREVIEW LOGIC */}
                                                    <div className="relative group inline-block">
                                                        <button className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                                                            <ImageIcon size={18} />
                                                        </button>

                                                        {/* Preview Hover Card */}
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block z-50">
                                                            <div className="bg-white border rounded-lg shadow-2xl p-2 w-56 animate-in fade-in zoom-in duration-150">
                                                                <img
                                                                    src={req.file_path || 'https://via.placeholder.com/200x250?text=No+Preview'}
                                                                    alt="Submission"
                                                                    className="w-full h-auto rounded border"
                                                                />
                                                                <div className="mt-2 text-center text-[10px] text-gray-500 font-medium">
                                                                    Document Preview
                                                                </div>
                                                            </div>
                                                            <div className="w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 text-xs">
                                                    {new Date(req.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Summary & Distribution (4 Columns) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Request Status Distribution */}
                        <div className="bg-white border rounded-xl shadow-sm p-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <BarChart3 size={16} />
                                Status Distribution
                            </h3>
                            <div className="space-y-5">
                                {[
                                    { label: 'Completed', count: stats.completed, color: 'bg-green-500' },
                                    { label: 'Pending', count: stats.pending, color: 'bg-amber-500' },
                                    { label: 'Processing', count: stats.processing, color: 'bg-blue-500' },
                                    { label: 'Rejected', count: stats.rejected, color: 'bg-red-500' },
                                ].map((item) => {
                                    const percent = stats.total > 0 ? (item.count / stats.total) * 100 : 0;
                                    return (
                                        <div key={item.label}>
                                            <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
                                                <span className="text-gray-600">{item.label}</span>
                                                <span className="text-gray-900">{item.count}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full ${item.color} transition-all duration-700`}
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-gray-900 rounded-xl p-6 text-white shadow-lg">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <Info size={16} />
                                Metrics Summary
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase">Success Rate</p>
                                        <p className="text-3xl font-bold">{completionRate}%</p>
                                    </div>
                                    <div className="p-3 bg-green-500/20 text-green-400 rounded-lg">
                                        <CheckCircle size={24} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-800">
                                    <div>
                                        <p className="text-gray-400 text-[10px] uppercase">Active Queue</p>
                                        <p className="text-xl font-bold text-amber-400">{stats.pending + stats.processing}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-[10px] uppercase">Total Requests</p>
                                        <p className="text-xl font-bold text-white">{stats.total}</p>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 text-[11px] flex items-center gap-2">
                                        <Clock size={14} />
                                        Update reflects real-time data
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
