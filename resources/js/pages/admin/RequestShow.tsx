// pages/admin/RequestShow.tsx
import { Head } from '@inertiajs/react';
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
    attachment_url?: string;
}

interface Props {
    request: DocumentRequest;
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Requests', href: '/admin/requests' },
    { title: 'Details', href: '' },
];

export default function RequestShow({ request }: Props) {
    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Request Details" />
            <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Request #{request.id}</h2>
                <p>
                    <strong>Student:</strong> {request.user.name} ({request.user.email})
                </p>
                <p>
                    <strong>Document Type:</strong> {request.document_type.name}
                </p>
                <p>
                    <strong>Purpose:</strong> {request.purpose}
                </p>
                <p>
                    <strong>Copies:</strong> {request.copies}
                </p>
                <p>
                    <strong>Status:</strong> {request.status}
                </p>
                <p>
                    <strong>Submitted:</strong> {new Date(request.created_at).toLocaleString()}
                </p>
                {request.attachment_url && (
                    <div className="mt-4">
                        <strong>Attachment:</strong>
                        <div>
                            <img
                                src={request.attachment_url}
                                alt="Attachment"
                                className="max-w-full h-auto rounded border"
                            />
                        </div>
                    </div>
                )}
            </div>
        </AppSidebarLayout>
    );
}
