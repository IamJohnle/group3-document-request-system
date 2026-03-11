import { Head } from '@inertiajs/react';
import {
    BarChart3,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    TrendingUp,
    Download,
} from 'lucide-react';
import React from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';

interface DocumentRequest {
    id: number;
    status: string;
    purpose: string;
    copies: number;
    created_at: string;
    user: {
        name: string;
    };
    documentType: {
        name: string;
    };
}

interface ReportsProps {
    requests?: DocumentRequest[];
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Reports', href: '/admin/reports' },
];

const Reports = ({ requests = [] }: ReportsProps) => {
    // Calculate statistics
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'Pending').length,
        processing: requests.filter(r => r.status === 'Processing').length,
        completed: requests.filter(r => r.status === 'Completed').length,
        rejected: requests.filter(r => r.status === 'Rejected').length,
    };

    const completionRate = stats.total > 0 
        ? Math.round((stats.completed / stats.total) * 100)
        : 0;

    const pendingRate = stats.total > 0 
        ? Math.round((stats.pending / stats.total) * 100)
        : 0;

    // Group requests by document type
    const requestsByType = requests.reduce((acc: Record<string, number>, req) => {
        const typeName = req.documentType.name;
        acc[typeName] = (acc[typeName] || 0) + 1;
        return acc;
    }, {});

    // Group requests by status
    const requestsByStatus = {
        pending: stats.pending,
        processing: stats.processing,
        completed: stats.completed,
        rejected: stats.rejected,
    };

    const statCards = [
        {
            label: 'Total Requests',
            value: stats.total,
            icon: FileText,
            color: 'text-blue-600',
            bg: 'bg-blue-50 border-blue-100',
        },
        {
            label: 'Pending',
            value: stats.pending,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50 border-amber-100',
            subtitle: `${pendingRate}% pending`,
        },
        {
            label: 'Processing',
            value: stats.processing,
            icon: TrendingUp,
            color: 'text-purple-600',
            bg: 'bg-purple-50 border-purple-100',
        },
        {
            label: 'Completed',
            value: stats.completed,
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-50 border-green-100',
            subtitle: `${completionRate}% completed`,
        },
        {
            label: 'Rejected',
            value: stats.rejected,
            icon: AlertCircle,
            color: 'text-red-600',
            bg: 'bg-red-50 border-red-100',
        },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
                        <p className="text-muted-foreground text-sm">Analytics and statistics for document requests.</p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
                        <Download size={16} /> Export Report
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {statCards.map((stat, index) => (
                        <div key={index} className={`p-5 rounded-xl border shadow-sm flex flex-col gap-2 bg-white`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                                    <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                                    {stat.subtitle && <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>}
                                </div>
                                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Status Distribution */}
                    <div className="bg-white rounded-xl border shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <BarChart3 size={20} />
                            Request Status Distribution
                        </h2>
                        <div className="space-y-4">
                            {Object.entries(requestsByStatus).map(([status, count]) => {
                                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                                const statusColor = 
                                    status === 'completed' ? 'bg-green-500' :
                                    status === 'pending' ? 'bg-amber-500' :
                                    status === 'processing' ? 'bg-blue-500' :
                                    'bg-red-500';

                                return (
                                    <div key={status}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium capitalize">{status}</span>
                                            <span className="text-sm font-semibold">{count} ({Math.round(percentage)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-500 ${statusColor}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Document Type Distribution */}
                    <div className="bg-white rounded-xl border shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <FileText size={20} />
                            Requests by Document Type
                        </h2>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto">
                            {Object.entries(requestsByType).length > 0 ? (
                                Object.entries(requestsByType).map(([docType, count]) => {
                                    const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                                    return (
                                        <div key={docType}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium truncate">{docType}</span>
                                                <span className="text-sm font-semibold ml-2">{count}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full bg-indigo-500 transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-muted-foreground text-sm">No request data available.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Summary Metrics */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <p className="text-muted-foreground mb-1">Processing Queue</p>
                            <p className="text-2xl font-bold text-amber-600">{stats.pending + stats.processing}</p>
                            <p className="text-xs text-muted-foreground mt-1">Requests awaiting action</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-1">Success Rate</p>
                            <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
                            <p className="text-xs text-muted-foreground mt-1">Of total requests completed</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-1">Average Per Type</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {Object.keys(requestsByType).length > 0 
                                    ? Math.round(stats.total / Object.keys(requestsByType).length)
                                    : 0
                                }
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Requests per document type</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
};

export default Reports;
