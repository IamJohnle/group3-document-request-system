import { Head, Link, router } from '@inertiajs/react';
import {
    
    CheckCircle,
    Clock,
    FileText,
    Filter,
    Search,
    TrendingUp,
    Eye,
    Edit,
    Trash2,
    Image as ImageIcon,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';

interface DocumentRequest {
    id: number;
    status: string;
    purpose: string;
    copies: number;
    attachment: string | null;
    user: { name: string; email?: string };
    document_type?: { name: string };
    documentType?: { name: string };
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
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleUpdateStatus = (id: number, newStatus: string) => {
        if (confirm(`Change status to ${newStatus}?`)) {
            router.post(`/admin/requests/${id}/status`, { status: newStatus }, { preserveScroll: true });
        }
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this request?')) return;
        router.delete(route('admin.requests.destroy', { documentRequest: id }));
    };

    const filteredRequests = requests.filter((req) =>
        (req.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        ((req.document_type?.name || req.documentType?.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );

    // Using AlertCircle, CheckCircle, Clock, FileText, TrendingUp here
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'Pending').length,
        processing: requests.filter(r => r.status === 'Processing').length,
        completed: requests.filter(r => r.status === 'Completed').length,
    };

    const statCards = [
        { label: 'Total', value: stats.total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Processing', value: stats.processing, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Document Requests" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Document Requests</h1>
                        <p className="text-muted-foreground text-sm">Review and manage student document applications.</p>
                    </div>
                </div>

                {/* Stat Cards - Uses AlertCircle, CheckCircle, etc. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat, i) => (
                        <div key={i} className="p-4 rounded-xl border bg-white shadow-sm flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase">{stat.label}</p>
                                <h3 className="text-xl font-bold">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="font-semibold text-gray-800">Application List</h2>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search student or document..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 pr-3 py-1.5 border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                                />
                            </div>
                            {/* Uses Filter icon */}
                            <button className="p-2 border rounded-md hover:bg-gray-50 text-gray-500">
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
                                    <th className="px-6 py-3 border-b">Attachment</th>
                                    <th className="px-6 py-3 border-b">Status</th>
                                    <th className="px-6 py-3 border-b text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{req.user?.name}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {req.document_type?.name || req.documentType?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.attachment ? (
                                                <button 
                                                    onClick={() => setPreviewImage(`/storage/${req.attachment}`)}
                                                    className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold"
                                                >
                                                    <ImageIcon size={14} /> View
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">None</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                                                req.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' :
                                                req.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                req.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                'bg-blue-50 text-blue-700 border-blue-100'
                                            }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <select
                                                    className="text-xs border rounded p-1 outline-none focus:ring-1 focus:ring-indigo-500"
                                                    value={req.status}
                                                    onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                                
                                                {/* Uses Eye, Edit, and Trash2 icons */}
                                                <Link href={route('admin.requests.show', { documentRequest: req.id })} className="text-gray-400 hover:text-indigo-600" title="View Details">
                                                    <Eye size={18} />
                                                </Link>
                                                <Link href={route('admin.requests.edit', { documentRequest: req.id })} className="text-gray-400 hover:text-green-600" title="Edit Application">
                                                    <Edit size={18} />
                                                </Link>
                                                <button onClick={() => handleDelete(req.id)} className="text-gray-400 hover:text-red-600" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* PREVIEW MODAL - Uses X icon */}
            {previewImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setPreviewImage(null)} />
                    <div className="relative bg-white p-2 rounded-2xl max-w-5xl w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-2">
                            <span className="text-sm font-bold text-gray-500 ml-2">Document Attachment Preview</span>
                            <button onClick={() => setPreviewImage(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center min-h-[400px]">
                            {previewImage.toLowerCase().endsWith('.pdf') ? (
                                <iframe src={previewImage} className="w-full h-[75vh]" title="PDF Preview" />
                            ) : (
                                <img src={previewImage} alt="Preview" className="max-w-full max-h-[80vh] object-contain shadow-sm" />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AppSidebarLayout>
    );
}