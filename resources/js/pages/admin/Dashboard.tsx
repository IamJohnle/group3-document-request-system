import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import {
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    Users,
    TrendingUp,
    ArrowUpRight,
    MoreHorizontal
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

export default function Dashboard() {
    // Mock data for visualization - in a real app, these would come from props
    const stats = [
        { label: 'Total Requests', value: '1,284', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending Approval', value: '42', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Completed Today', value: '15', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    const recentRequests = [
        { id: 'DR-1002', name: 'John Doe', document: 'Birth Certificate', status: 'Processing', date: '2 mins ago' },
        { id: 'DR-1001', name: 'Maria Santos', document: 'Report Card (Form 138)', status: 'Pending', date: '15 mins ago' },
        { id: 'DR-1000', name: 'James Wilson', document: 'Medical Record', status: 'Completed', date: '1 hour ago' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">System Overview</h1>
                        <p className="text-muted-foreground text-sm">Welcome back, Admin. Here is what's happening today.</p>
                    </div>
                    <button className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900">
                        Generate Report
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    {stats.map((stat, i) => (
                        <div key={i} className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:bg-neutral-900">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                    <h3 className="mt-1 text-3xl font-bold">{stat.value}</h3>
                                </div>
                                <div className={`rounded-lg ${stat.bg} p-3 dark:bg-neutral-800`}>
                                    <stat.icon className={`size-6 ${stat.color}`} />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-emerald-600">
                                <TrendingUp className="mr-1 size-3" />
                                <span>12% increase from last week</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid gap-6 lg:grid-cols-7">

                    {/* Recent Requests Table (Requirement c & d) */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-white shadow-sm lg:col-span-4 dark:bg-neutral-900">
                        <div className="flex items-center justify-between border-b p-4">
                            <h2 className="font-semibold">Recent Requests</h2>
                            <button className="text-sm text-blue-600 hover:underline">View All</button>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Student</th>
                                        <th className="px-4 py-3 font-medium">Document</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {recentRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{req.name}</div>
                                                <div className="text-xs text-muted-foreground">{req.id}</div>
                                            </td>
                                            <td className="px-4 py-3">{req.document}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
                                                    ${req.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                                      req.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                                      'bg-amber-100 text-amber-700'}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button className="rounded p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                                    <MoreHorizontal className="size-4 text-muted-foreground" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Monitoring / System Health (Requirement a & d) */}
                    <div className="flex flex-col gap-6 lg:col-span-3">
                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-5 shadow-sm dark:bg-neutral-900">
                            <h2 className="mb-4 font-semibold">Document Distribution</h2>
                            <div className="space-y-4">
                                {[
                                    { label: 'Birth Certificates', count: 450, color: 'bg-blue-500' },
                                    { label: 'Report Cards', count: 320, color: 'bg-purple-500' },
                                    { label: 'Medical Records', count: 120, color: 'bg-pink-500' },
                                ].map((item) => (
                                    <div key={item.label} className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span>{item.label}</span>
                                            <span className="font-medium">{item.count}</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800">
                                            <div
                                                className={`h-2 rounded-full ${item.color}`}
                                                style={{ width: `${(item.count / 500) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-xl bg-neutral-900 p-5 text-white dark:bg-neutral-100 dark:text-neutral-900">
                            <div className="relative z-10">
                                <h3 className="font-semibold">User Management</h3>
                                <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">Manage 842 registered students and parents.</p>
                                <button className="mt-4 flex items-center text-sm font-medium hover:underline">
                                    Go to Users <ArrowUpRight className="ml-1 size-4" />
                                </button>
                            </div>
                            <Users className="absolute -right-4 -bottom-4 size-24 opacity-10" />
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
