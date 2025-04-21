'use client'

import React, { useEffect, useState } from 'react';
import { Trash, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { getRequestData, updateRequest } from '@/actions/populateTables';

type location = {
    locationID: string;
    locationName: string;
}

interface IRequest {
    id: number;
    userId: string;
    location_id: string;
    location: location | null;
    startDate: string | null;
    endDate: string | null;
    usage: string | null;
    bucket: string | null;
    format: string | null;
    is_delivered: boolean;
    created_at: Date;
    updated_at: Date | null;
}

const DownloadRequestsPage = () => {
    const { data: session } = authClient.useSession();
    const [requests, setRequests] = useState<IRequest[]>([]);
    const router = useRouter();

    const handleCreateRequest = () => {
        router.push('/historical');
    };

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/')
                }
            }
        });
    };

    const handleDeleteRequest = async (id: string) => {
        await updateRequest(id);
        router.refresh();
    };

    useEffect(() => {
        const fetchData = async () => {
            if (session) {
                const data = await getRequestData(session);
                setRequests(data);
            }
        };
        fetchData();
    }, [session]);

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-semibold text-gray-700 text-center mb-6">
                    Download Requests for&nbsp;
                    <span className="font-bold text-blue-700">{session?.user?.email}</span>
                </h1>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                    <Button
                        onClick={handleCreateRequest}
                        className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded shadow-md transition duration-150 ease-in-out"
                    >
                        Create New Request
                    </Button>
                    <Button
                        onClick={handleLogout}
                        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-8 rounded shadow-md transition duration-150 ease-in-out"
                    >
                        Logout
                    </Button>
                </div>

                {/* Requests Table */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone of Interest</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bucket</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.format}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div>{`${request.startDate} : ${request.endDate}`}</div>
                                            <div className="text-xs text-gray-500">{request.location?.locationName}</div>
                                            <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium">
                                                View on Map
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.bucket}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.created_at?.toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="font-semibold">{request.is_delivered ? 'Processed' : 'Not processed'}</div>
                                            <div className="text-xs text-gray-500">{`on ${request.updated_at?.toLocaleDateString()}`}</div>
                                            <div className="text-xs text-gray-500">{request.is_delivered ? 'Download' : 'Download - N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <Button
                                                onClick={() => handleDeleteRequest(request.id.toString())}
                                                variant={'destructive'}
                                                className="text-gray-600 hover:text-gray-800"
                                                aria-label={`Delete request ${request.id}`}
                                            >
                                                <Trash size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {requests.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                            No download requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-8 text-center text-sm text-gray-600 space-y-2">
                    {/* <div>
                        <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center">
                            <Mail className="mr-1" size={16} /> LANCE-MODIS mailing list
                        </a>
                    </div> */}
                    <div>
                        <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center">
                            <Mail className="mr-1" size={16} /> KINAQ mailing list
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DownloadRequestsPage;