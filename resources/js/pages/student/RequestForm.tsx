// pages/student/RequestForm.tsx
import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import AppSidebarLayout from '../../layouts/app/app-sidebar-layout';

interface RequestFormProps {
  documentTypes: Array<{ id: number; name: string }>;
}

const RequestForm = ({ documentTypes }: RequestFormProps) => {
  const form = useForm({
    document_type_id: '',
    purpose: '',
    copies: 1,
    file: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.post(route('student.requests.store'));
  };

  return (
    <AppSidebarLayout>
      <Head title="New Request" />
      <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">New Document Request</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Document Type</label>
          <select
            className="w-full border rounded-md p-2"
            value={form.data.document_type_id}
            onChange={(e) => form.setData('document_type_id', e.target.value)}
          >
            <option value="">Select a document...</option>
            {documentTypes.map((dt) => (
              <option key={dt.id} value={dt.id}>{dt.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Purpose</label>
          <textarea
            rows={3}
            placeholder="Ex: Employment, Transfer, Scholarship..."
            className="w-full border rounded-md p-2"
            value={form.data.purpose}
            onChange={(e) => form.setData('purpose', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Number of Copies</label>
          <input
            type="number" min="1"
            className="w-32 border rounded-md p-2"
            value={form.data.copies}
            onChange={(e) => form.setData('copies', parseInt(e.target.value))}
          />
        </div>

        <div className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center">
          <label className="block text-sm font-medium mb-2">Upload Requirements (ID/Old Records)</label>
          <input type="file" className="mx-auto" onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                  form.setData('file', e.target.files[0]);
              }
          }} />
          <p className="text-xs text-gray-400 mt-2 italic">Accepted: PDF, JPG, PNG (Max 5MB)</p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition"
        >
          Submit Request
        </button>
      </form>
    </div>
    </AppSidebarLayout>
  );
};

export default RequestForm;
