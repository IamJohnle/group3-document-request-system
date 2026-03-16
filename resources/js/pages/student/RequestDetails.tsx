import { Head, Link } from '@inertiajs/react';
import React from 'react';
import AppSidebarLayout from '../../layouts/app/app-sidebar-layout';
import StatusBadge from './components/StatusBadge';

interface DocumentRequest {
  id: number;
  purpose: string;
  copies: number;
  status: string;
  created_at: string;
  updated_at: string;
  documentType: {
    name: string;
  };
}

interface RequestDetailsProps {
  request: DocumentRequest;
}

const RequestDetails = ({ request }: RequestDetailsProps) => {
  return (
    <AppSidebarLayout>
      <Head title={`Request Details - REQ-${request.id}`} />

      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Request Details</h1>
              <p className="text-gray-500 font-mono text-sm">REQ-{request.id.toString().padStart(4, '0')}</p>
            </div>
            <Link href={route('student.history')} className="text-sm text-blue-600 hover:underline">
              &larr; Back to History
            </Link>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Document Type</label>
              <p className="font-semibold text-lg">{request.documentType?.name}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Status</label>
              <div><StatusBadge status={request.status} /></div>
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="text-xs font-bold text-gray-400 uppercase">Purpose</label>
            <p className="mt-1 text-gray-700">{request.purpose}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Copies</label>
              <p className="font-medium">{request.copies}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Date Requested</label>
              <p className="text-gray-600">{new Date(request.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
};

export default RequestDetails;