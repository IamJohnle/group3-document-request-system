// pages/student/components/StatusBadge.tsx
import React from 'react';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: { [key: string]: string } = {
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Approved': 'bg-blue-100 text-blue-800 border-blue-200',
    'Processing': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Completed': 'bg-green-100 text-green-800 border-green-200',
    'Rejected': 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
