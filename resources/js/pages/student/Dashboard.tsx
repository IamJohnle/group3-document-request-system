// pages/student/Dashboard.tsx
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import AppSidebarLayout from '../../layouts/app/app-sidebar-layout';
import StatusBadge from './components/StatusBadge';
interface DashboardProps {
  stats: { pending: number; completed: number; actionRequired: number };
  recentRequests: Array<{ id: number; document_type: { name: string }; created_at: string; status: string }>;
}

const Dashboard = ({ stats, recentRequests }: DashboardProps) => {

  return (
    <AppSidebarLayout>
      <Head title="Student Dashboard" />
      <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-400">
          <p className="text-sm text-gray-500 uppercase font-bold">Pending Requests</p>
          <p className="text-3xl font-bold">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-500 uppercase font-bold">Completed</p>
          <p className="text-3xl font-bold">{stats.completed}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-sm text-gray-500 uppercase font-bold">Action Required</p>
          <p className="text-3xl font-bold text-red-600">{stats.actionRequired}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Requests</h2>
          <Link href={route("student.history")} className="text-blue-600 hover:underline text-sm font-medium">
            View All
          </Link>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Document</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentRequests.map((req) => (
              <tr key={req.id}>
                <td className="px-6 py-4 font-medium">{req.document_type.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(req.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={req.status} />
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

export default Dashboard;
