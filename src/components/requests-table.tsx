'use client';

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Mail, Trash } from 'lucide-react';

import { updateRequest } from '@/actions/populateTables';
import { authClient } from '@/lib/auth-client';
import { formatDateToLocaleString, formatDateToLocaleStringWithoutTime } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

const RequestsTable = ({ requests }: { requests: IRequest[] }) => {
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('Request');

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

    return (
        <>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                <Button
                    onClick={handleCreateRequest}
                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded shadow-md transition duration-150 ease-in-out"
                >
                    {t('newRequest')}
                </Button>
                <Button
                    onClick={handleLogout}
                    variant={'destructive'}
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-8 rounded shadow-md transition duration-150 ease-in-out"
                >
                    {t('Logout')}
                </Button>
            </div>
            {/* Requests Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        {requests.length !== 0 && (<TableCaption>{t('listTitle')}</TableCaption>)}
                        <TableHeader className='bg-gray-100'>
                            <TableRow>
                                <TableHead className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Id</TableHead>
                                <TableHead className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>Source</TableHead>
                                <TableHead className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>Zone of Interest</TableHead>
                                <TableHead className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>Bucket</TableHead>
                                <TableHead className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>Request Date</TableHead>
                                <TableHead className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>Status</TableHead>
                                <TableHead className='px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider' title="Delete">{ }</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell className="font-medium">{request.id}</TableCell>
                                    <TableCell>{request.format}</TableCell>
                                    <TableCell>
                                        <div>{`${formatDateToLocaleStringWithoutTime(locale, request?.startDate ?? '')} : ${formatDateToLocaleStringWithoutTime(locale, request.endDate ?? '')}`}</div>
                                        <div className="text-xs text-gray-500">{request.location?.locationName}</div>
                                        <Link href="#" className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium">
                                            View on Map
                                        </Link>
                                    </TableCell>
                                    <TableCell className="">{request.bucket}</TableCell>
                                    <TableCell className="">{formatDateToLocaleString(locale, request.created_at.toString())}</TableCell>
                                    <TableCell className="">
                                        <div className="font-semibold">{request.is_delivered ? 'Processed' : 'Not processed'}</div>
                                        <div className="text-xs text-gray-500">{`on ${formatDateToLocaleString(locale, request.updated_at?.toString() || '')}`}</div>
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
                        </TableBody>
                        {requests.length === 0 && (
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={7} className="w-full px-6 py-4 text-center text-sm text-gray-500">
                                        No download requests found.
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        )}
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
        </>
    );
};

export default RequestsTable;