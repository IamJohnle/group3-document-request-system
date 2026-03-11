import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function History({ requests }: any) {
    const createRequestUrl = '/requests/create';
    return (
        <AppLayout breadcrumbs={[{ title: 'My Requests', href: '/history' }]}>
            <Head title="Request History" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">My Requests</h1>
                    <Link
                        href={createRequestUrl}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold"
                    >
                        New Request
                    </Link>
                </div>

                <div className="bg-white dark:bg-neutral-900 border rounded shadow-sm">
                    {requests.length === 0 ? (
                        <p className="p-10 text-center text-neutral-500">No requests found.</p>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-neutral-800">
                                <tr>
                                    <th className="p-4">Document</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req: any) => (
                                    <tr key={req.id} className="border-b dark:border-neutral-800">
                                        <td className="p-4">{req.documentType.name}</td>
                                        <td className="p-4">{new Date(req.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 font-bold">{req.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
