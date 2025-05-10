import { getRequestData } from '@/actions/populateTables';
import RequestsTable from '@/components/requests-table';
import { getUser } from '@/lib/auth-session';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const DownloadRequestsPage = async () => {
    const user = await getUser();
    if (!user) redirect('/historical');

    const requests = await getRequestData(user);

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-semibold text-gray-700 text-center mb-6">
                    Download Requests for&nbsp;
                    <span className="font-bold text-blue-700">{user?.email}</span>
                </h1>

                <Suspense fallback={<p className='text-xl font-medium text-center'>Loading table requests...</p>}>
                    <RequestsTable requests={requests} />
                </Suspense>
            </div>
        </div>
    );
};

export default DownloadRequestsPage;