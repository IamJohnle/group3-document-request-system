// pages/student/History.tsx
import { Head } from '@inertiajs/react';
import React from 'react';
import AppSidebarLayout from '../../layouts/app/app-sidebar-layout';
import StatusBadge from './components/StatusBadge';

interface HistoryProps {
  requests: Array<{ id: number; reference: string; document_type: { name: string }; created_at: string; status: string }>;
}

const History = ({ requests }: HistoryProps) => {
  return (
    <AppSidebarLayout>
      <Head title="Request History" />
      <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Request History</h1>
        <input type="text" placeholder="Search requests..." className="border rounded-md px-3 py-1 text-sm w-64" />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Ref ID</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Document</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Date Requested</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-4 font-mono text-sm text-gray-600">REQ-{r.id}</td>
                <td className="px-6 py-4 font-medium">{r.document_type.name}</td>
                <td className="px-6 py-4 text-sm">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 text-sm font-bold hover:underline">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </AppSidebarLayout>
  );
};

export default History;
