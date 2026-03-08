import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const IconUpload = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 text-neutral-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;

interface Props {
    availableTypes: { id: number; name: string }[];
}

export default function RequestForm({ availableTypes }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        document_type_id: '',
        purpose: '',
        copies: 1,
        attachment: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/requests');
    };

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'New Request', href: '#' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Document Request" />
            <div className="mx-auto max-w-2xl p-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Document Request</h1>
                    <p className="text-sm text-neutral-500">Please fill out the form below to request official school documents.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    {/* Document Type */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Select Document</label>
                        <select
                            className="mt-1 block w-full rounded-lg border-neutral-200 bg-neutral-50 p-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-800"
                            value={data.document_type_id}
                            onChange={e => setData('document_type_id', e.target.value)}
                        >
                            <option value="">Choose a document...</option>
                            {availableTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                        {errors.document_type_id && <p className="mt-1 text-xs text-red-500">{errors.document_type_id}</p>}
                    </div>

                    {/* Purpose & Copies */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Number of Copies</label>
                            <input
                                type="number" min="1"
                                className="mt-1 block w-full rounded-lg border-neutral-200 bg-neutral-50 p-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-800"
                                value={data.copies}
                                onChange={e => setData('copies', parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Purpose</label>
                            <input
                                type="text" placeholder="e.g. Employment, Transfer"
                                className="mt-1 block w-full rounded-lg border-neutral-200 bg-neutral-50 p-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-800"
                                value={data.purpose}
                                onChange={e => setData('purpose', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Requirements (ID, Clearance, etc.)</label>
                        <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-neutral-200 p-6 dark:border-neutral-800">
                            <div className="text-center">
                                <IconUpload />
                                <div className="mt-4 flex text-sm text-neutral-600 dark:text-neutral-400">
                                    <label className="relative cursor-pointer rounded-md font-semibold text-blue-600 hover:text-blue-500">
                                        <span>Upload a file</span>
                                        <input type="file" className="sr-only" onChange={(e) => setData('attachment', e.target.files ? e.target.files[0] : null)} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-neutral-500">PNG, JPG, PDF up to 2MB</p>
                                {data.attachment && <p className="mt-2 text-xs font-bold text-emerald-500">Selected: {data.attachment.name}</p>}
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={processing}
                        className="w-full rounded-lg bg-neutral-900 py-3 text-sm font-bold text-white transition-all hover:bg-neutral-800 active:scale-95 dark:bg-neutral-100 dark:text-neutral-900"
                    >
                        {processing ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
