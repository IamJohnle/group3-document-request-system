import { Head, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import AppSidebarLayout from '../../layouts/app/app-sidebar-layout';

interface RequestFormProps {
  documentTypes: Array<{ id: number; name: string }>;
}

const RequestForm = ({ documentTypes }: RequestFormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 1. Initialize the form
  const form = useForm({
    document_type_id: 0,
    purpose: '',
    copies: 1,
    file: null as File | null,
  });

  // 2. Handle the file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    form.setData('file', file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  // 3. Cleanup memory on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // 4. THE HANDLER: This is the correct version inside the component
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // We use form.post. Inertia automatically handles FormData when a File is present
    form.post(route('student.requests.store'), { 
      forceFormData: true, 
      preserveScroll: true,
      onSuccess: () => {
        console.log('Request submitted successfully');
      },
      onError: (errors) => {
        console.error('Submission failed', errors);
      }
    });
  };

  return (
    <AppSidebarLayout>
      <Head title="New Request" />
      <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-6">New Document Request</h2>

        {/* This triggers the handleSubmit function defined above */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Document Type</label>
            <select
              className="w-full border rounded-md p-2"
              value={form.data.document_type_id || ''}
              onChange={(e) => form.setData('document_type_id', e.target.value ? parseInt(e.target.value) : 0)}
              required
            >
              <option value="">Select a document...</option>
              {documentTypes.map((dt) => (
                <option key={dt.id} value={dt.id}>{dt.name}</option>
              ))}
            </select>
            {form.errors.document_type_id && <div className="text-red-500 text-xs mt-1">{form.errors.document_type_id}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Purpose</label>
            <textarea
              rows={3}
              placeholder="Ex: Employment, Transfer, Scholarship..."
              className="w-full border rounded-md p-2"
              value={form.data.purpose}
              onChange={(e) => form.setData('purpose', e.target.value)}
              required
            />
            {form.errors.purpose && <div className="text-red-500 text-xs mt-1">{form.errors.purpose}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Number of Copies</label>
            <input
              type="number" 
              min="1"
              className="w-32 border rounded-md p-2"
              value={form.data.copies}
              onChange={(e) => form.setData('copies', parseInt(e.target.value))}
              required
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center">
            <label className="block text-sm font-medium mb-2">Upload Requirements (ID/Old Records)</label>
            <input 
              type="file" 
              accept="image/*,.pdf"
              className="mx-auto" 
              onChange={handleFileChange}
            />
            <p className="text-xs text-gray-400 mt-2 italic">Accepted: PDF, JPG, PNG (Max 5MB)</p>

            {previewUrl && (
              <div className="mt-4 p-2 border rounded bg-gray-50 relative">
                {form.data.file?.type.startsWith('image/') ? (
                  <img src={previewUrl} alt="Review" className="max-h-48 mx-auto rounded shadow-sm border" />
                ) : (
                  <div className="py-4 flex flex-col items-center">
                    <span className="text-4xl mb-2">📄</span>
                    <p className="text-sm text-gray-600 truncate max-w-xs">{form.data.file?.name}</p>
                  </div>
                )}
                <button 
                  type="button"
                  onClick={() => {
                    form.setData('file', null);
                    setPreviewUrl(null);
                  }}
                  className="mt-2 text-xs text-red-500 font-medium underline"
                >
                  Remove file
                </button>
              </div>
            )}
            {form.errors.file && <div className="text-red-500 text-xs mt-1">{form.errors.file}</div>}
          </div>

          <button
            type="submit"
            disabled={form.processing}
            className={`w-full py-2 rounded-md font-bold transition ${
              form.processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {form.processing ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </AppSidebarLayout>
  );
};

export default RequestForm;