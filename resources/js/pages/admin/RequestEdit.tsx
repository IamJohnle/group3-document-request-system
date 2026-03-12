// pages/admin/RequestEdit.tsx
import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import AppSidebarLayout from '../../layouts/app/app-sidebar-layout';

interface DocumentType {
    id: number;
    name: string;
}

interface DocumentRequest {
    id: number;
    status: string;
    purpose: string;
    copies: number;
    document_type: { id: number; name: string };
    attachment_url?: string;
}

interface Props {
    request: DocumentRequest;
    documentTypes: DocumentType[];
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Requests', href: '/admin/requests' },
    { title: 'Edit', href: '' },
];

export default function RequestEdit({ request, documentTypes }: Props) {
    const form = useForm({
        status: request.status,
        purpose: request.purpose,
        copies: request.copies,
        document_type_id: request.document_type.id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // still updating the whole record; the other route handles
        // status changes exclusively
        form.put(route('admin.requests.update', { docRequest: request.id }));
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Request" />

            <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Edit Request #{request.id}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Status</label>
                        <select
                            className="w-full border rounded p-2"
                            value={form.data.status}
                            onChange={(e) => form.setData('status', e.target.value)}
                        >
                            <option>Pending</option>
                            <option>Processing</option>
                            <option>Completed</option>
                            <option>Rejected</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Purpose</label>
                        <textarea
                            className="w-full border rounded p-2"
                            value={form.data.purpose}
                            onChange={(e) => form.setData('purpose', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Copies</label>
                        <input
                            type="number"
                            min="1"
                            className="w-24 border rounded p-2"
                            value={form.data.copies}
                            onChange={(e) => form.setData('copies', parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Document Type</label>
                        <select
                            className="w-full border rounded p-2"
                            value={form.data.document_type_id}
                            onChange={(e) => form.setData('document_type_id', Number(e.target.value))}
                        >
                            {documentTypes.map((dt) => (
                                <option key={dt.id} value={dt.id}>{dt.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        disabled={form.processing}
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
