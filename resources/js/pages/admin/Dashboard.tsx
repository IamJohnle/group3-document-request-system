import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    FileText,
    Search,
    TrendingUp,
    Users,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import AppSidebarLayout from '../../layouts/app/app-sidebar-layout';

interface DocumentRequest {
    id: number;
    status: string;
    purpose: string;
    copies: number;
    user: { name: string; email?: string };
    document_type: { name: string };
}

interface DashboardProps {
    allRequests: DocumentRequest[];
    stats: {
        total: number;
        pending: number;
        completed: number;
    };
}

const breadcrumbs = [{ title: 'Dashboard', href: '/admin/dashboard' }];

const Dashboard = ({
    allRequests = [],
    stats = { total: 0, pending: 0, completed: 0 },
}: DashboardProps) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('All');

    const rejectedCount = allRequests.filter(
        (r) => r?.status === 'Rejected',
    ).length;
    const completionRate =
        stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    const statCards = [
        {
            label: 'Total Requests',
            value: stats.total,
            icon: FileText,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Pending Approval',
            value: stats.pending,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
        },
        {
            label: 'Completed',
            value: stats.completed,
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            label: 'Rejected',
            value: rejectedCount,
            icon: AlertCircle,
            color: 'text-red-600',
            bg: 'bg-red-50',
        },
    ];

    const filteredRequests = useMemo(() => {
        return allRequests.filter((req) => {
            const matchesSearch = (req.user?.name ?? '')
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesFilter =
                filterStatus === 'All' || req.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [allRequests, searchTerm, filterStatus]);

    const handleUpdateStatus = (id: number, newStatus: string) => {
        router.post(
            route('admin.requests.status', { docRequest: id }),
            { status: newStatus },
            { preserveScroll: true },
        );
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <p className="text-sm text-muted-foreground">
                            System Overview & Management
                        </p>
                    </div>
                    <button
                        onClick={() => router.get('/admin/reports')}
                        className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
                    >
                        <TrendingUp size={16} /> View Full Reports
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {statCards.map((stat, i) => (
                        <div
                            key={i}
                            onClick={() =>
                                setFilterStatus(stat.label.split(' ')[0])
                            }
                            className="cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition-all hover:border-blue-300"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`rounded-lg p-2 ${stat.bg} ${stat.color}`}
                                >
                                    <stat.icon size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        {stat.label}
                                    </p>
                                    <h3 className="text-xl font-bold">
                                        {stat.value}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Recent Requests Table */}
                    <div className="rounded-xl border bg-white shadow-sm lg:col-span-2">
                        <div className="flex items-center justify-between border-b p-4">
                            <h2 className="font-semibold">Recent Activity</h2>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search
                                        size={14}
                                        className="absolute top-1/2 left-2.5 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search student..."
                                        className="rounded-md border py-1 pr-3 pl-8 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                                <select
                                    className="rounded-md border px-2 py-1 text-sm outline-none"
                                    value={filterStatus}
                                    onChange={(e) =>
                                        setFilterStatus(e.target.value)
                                    }
                                >
                                    <option value="All">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">
                                        Processing
                                    </option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            Student
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            Document
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredRequests.map((req) => (
                                        <tr
                                            key={req.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 font-medium">
                                                {req.user?.name ?? 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {req.document_type?.name ?? 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                                        req.status ===
                                                        'Completed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : req.status ===
                                                                'Pending'
                                                              ? 'bg-amber-100 text-amber-700'
                                                              : 'bg-blue-100 text-blue-700'
                                                    }`}
                                                >
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <select
                                                    className="rounded border p-1 text-xs"
                                                    value={req.status}
                                                    onChange={(e) =>
                                                        handleUpdateStatus(
                                                            req.id,
                                                            e.target.value,
                                                        )
                                                    }
                                                >
                                                    <option value="Pending">
                                                        Pending
                                                    </option>
                                                    <option value="Processing">
                                                        Processing
                                                    </option>
                                                    <option value="Completed">
                                                        Completed
                                                    </option>
                                                    <option value="Rejected">
                                                        Rejected
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Sidebar Summary */}
                    <div className="space-y-4">
                        <div className="rounded-xl border bg-white p-5 shadow-sm">
                            <h2 className="mb-4 text-sm font-semibold">
                                Request Summary
                            </h2>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">
                                        Completion Rate
                                    </span>
                                    <span className="font-bold">
                                        {completionRate}%
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className="h-full bg-green-500 transition-all"
                                        style={{ width: `${completionRate}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
                                <div className="flex gap-3">
                                    <AlertCircle
                                        size={18}
                                        className="text-blue-600"
                                    />
                                    <div>
                                        <p className="text-xs font-bold text-blue-900">
                                            Attention Required
                                        </p>
                                        <p className="mt-1 text-[11px] text-blue-700">
                                            {stats.pending} pending requests
                                            need your approval to proceed.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links for Admin */}
                        <div className="rounded-xl border bg-white p-5 shadow-sm">
                            <h2 className="mb-3 text-sm font-semibold">
                                Quick Management
                            </h2>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() =>
                                        router.get(route('admin.students'))
                                    }
                                    className="flex flex-col items-center gap-2 rounded-lg border p-3 text-xs hover:bg-gray-50"
                                >
                                    <Users size={16} /> Students
                                </button>
                                <button
                                    onClick={() =>
                                        router.get(route('admin.document-types'))
                                    }
                                    className="flex flex-col items-center gap-2 rounded-lg border p-3 text-xs hover:bg-gray-50"
                                >
                                    <FileText size={16} /> Doc Types
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
};

export default Dashboard;
