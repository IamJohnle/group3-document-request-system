import { Head, useForm } from '@inertiajs/react';
import {
    FileText,
    Pencil,
    Plus,
    Search,
    Trash2,
    X
} from 'lucide-react';
import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

// 1. Define the Shape of a Document Type
interface DocumentType {
    id: number;
    name: string;
    description: string | null;
    price: number;
    requirements: string | null;
    created_at: string;
}

// 2. Define the Props coming from the Controller
interface Props {
    documentTypes: DocumentType[]; // Matches DocumentRequestController 'documentTypes' => DocumentType::all()
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Document Types', href: '/admin/document-types' },
];

export default function DocumentTypes(props?: Props) {
    const documentTypes = props?.documentTypes || [];
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DocumentType | null>(null);

    // 3. Form Handling with Type Safety
    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        price: 0,
        requirements: '',
    });

    const openModal = (item: DocumentType | null = null) => {
        if (item) {
            setEditingItem(item);
            setData({
                name: item.name,
                description: item.description || '',
                price: item.price || 0,
                requirements: item.requirements || '',
            });
        } else {
            setEditingItem(null);
            reset();
        }
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            put(route('admin.document-types.update', editingItem.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.document-types.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this document type?')) {
            destroy(route('admin.document-types.destroy', id));
        }
    };

    // 4. Filtering Logic
    const filteredTypes = documentTypes.filter((type) =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Document Types" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Document Types</h1>
                        <p className="text-muted-foreground text-sm">Manage the documents available for student requests.</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-indigo-700 transition-colors"
                    >
                        <Plus size={16} /> Add New Document
                    </button>
                </div>

                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-gray-800">Available Documents</h2>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                {filteredTypes.length} Total
                            </span>
                        </div>
                        <div className="relative">
                            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search document names..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 pr-3 py-1.5 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-xs font-medium text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-6 py-3 border-b">Document Name</th>
                                    <th className="px-6 py-3 border-b">Price</th>
                                    <th className="px-6 py-3 border-b">Requirements</th>
                                    <th className="px-6 py-3 border-b text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {filteredTypes.length > 0 ? (
                                    filteredTypes.map((type) => (
                                        <tr key={type.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                        <FileText size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{type.name}</div>
                                                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                                            {type.description || 'No description'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-700">
                                                ₱{Number(type.price).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground italic">
                                                {type.requirements || 'None'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openModal(type)}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(type.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                            No document types found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h3 className="text-lg font-bold">{editingItem ? 'Edit Document' : 'New Document Type'}</h3>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Price</label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={e => setData('price', Number(e.target.value))}
                                        className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Reqs</label>
                                    <input
                                        type="text"
                                        value={data.requirements}
                                        onChange={e => setData('requirements', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppSidebarLayout>
    );
}
