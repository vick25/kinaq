'use client'

import { useEffect, useState } from 'react';
import { Trash, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from "@/components/ui/table"

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { getRequestData, updateRequest } from '@/actions/populateTables';
import Link from 'next/link';

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
                        <Table>
                            <TableCaption>A list of your recent requests.</TableCaption>
                            <TableHeader className='bg-gray-100'>
                                <TableRow>
                                    <TableHead className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Id</TableHead>
                                    <TableHead className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>Source</TableHead>
                                    <TableHead className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>Zone of Interest</TableHead>
                                    <TableHead className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>Bucket</TableHead>
                                    <TableHead className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>Request Date</TableHead>
                                    <TableHead className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>Status</TableHead>
                                    <TableHead className='px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider'>Delete</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell className="font-medium">{request.id}</TableCell>
                                        <TableCell>{request.format}</TableCell>
                                        <TableCell>
                                            <div>{`${request.startDate} : ${request.endDate}`}</div>
                                            <div className="text-xs text-gray-500">{request.location?.locationName}</div>
                                            <Link href="#" className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium">
                                                View on Map
                                            </Link>
                                        </TableCell>
                                        <TableCell className="">{request.bucket}</TableCell>
                                        <TableCell className="">{request.created_at?.toLocaleDateString()}</TableCell>
                                        <TableCell className="">
                                            <div className="font-semibold">{request.is_delivered ? 'Processed' : 'Not processed'}</div>
                                            <div className="text-xs text-gray-500">{`on ${request.updated_at?.toLocaleDateString()}`}</div>
                                            <div className="text-xs text-gray-500">{request.is_delivered ? 'Download' : 'Download - N/A'}</div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                onClick={() => handleDeleteRequest(request.id.toString())}
                                                variant={'destructive'}
                                                className="text-gray-600 hover:text-gray-800"
                                                aria-label={`Delete request ${request.id}`}
                                            >
                                                <Trash size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {requests.length === 0 && (
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell className="px-6 py-4 text-center text-sm text-gray-500">
                                                No download requests found.
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                )}
                            </TableBody>
                        </Table>
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