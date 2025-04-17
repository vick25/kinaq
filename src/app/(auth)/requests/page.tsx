'use client'

import React from 'react';
import { Trash, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";

const userEmail = 'vickadiata@gmail.com';
const requests = [
    {
        id: '502624',
        source: 'CSV',
        dateRange: '2023-08-01 : 2024-08-19',
        coords: '[14.271, 7.778; 20.139, 11.653]',
        requestDate: '2024-08-19 10:11:01',
        status: 'Processed',
        statusDate: 'on 2024-08-19 10:19:46',
        downloadInfo: 'Download - N/A',
    },
    {
        id: '498668',
        source: 'CSV',
        dateRange: '2023-09-01 : 2024-06-30',
        coords: '[19.27, 10.555; 20.081, 11.09]',
        requestDate: '2024-08-07 15:57:17',
        status: 'Processed',
        statusDate: 'on 2024-08-07 15:59:20',
        downloadInfo: 'Download - N/A',
    },
    {
        id: '424087',
        source: 'CSV',
        dateRange: '2022-12-01 : 2024-02-08',
        coords: '[25.814, -8.555; 30.71, -4.857]',
        requestDate: '2024-02-08 10:38:36',
        status: 'Processed',
        statusDate: 'on 2024-02-08 10:42:21',
        downloadInfo: 'Download - N/A',
    },
    {
        id: '424079',
        source: 'CSV',
        dateRange: '2023-01-01 : 2024-01-01',
        coords: '[7.103, -14.027; 38.692, 9.83]',
        requestDate: '2024-02-08 10:14:31',
        status: 'Processed',
        statusDate: 'on 2024-02-08 10:23:15',
        downloadInfo: 'Download - N/A',
    },
    {
        id: '423560',
        source: 'CSV',
        dateRange: '2020-01-01 : 2024-01-01',
        coords: '[7.103, -14.027; 38.692, 9.83]', // Note: Coords reused from above for example
        requestDate: '2024-02-07 12:09:42',
        status: 'Processed',
        statusDate: 'on 2024-02-07 12:16:30',
        downloadInfo: 'Download - N/A',
    },
    {
        id: '400944',
        source: 'CSV',
        dateRange: '2020-01-01 : 2022-12-31',
        coords: '[11.23, -14.027; 34.03, 9.82]',
        requestDate: '2023-11-13 10:49:40',
        status: 'Processed',
        statusDate: 'on 2023-11-13 10:55:10',
        downloadInfo: 'Download - N/A',
    },
    {
        id: '365705',
        source: 'CSV',
        dateRange: '2010-01-01 : 2020-12-31',
        coords: '[19.171, 0.67; 23.593, 3.283]',
        requestDate: '2023-07-14 10:57:28',
        status: 'Processed',
        statusDate: 'on 2023-07-14 11:12:25',
        downloadInfo: 'Download - N/A',
    },
    // Add more request objects here
];

const DownloadRequestsPage = () => {
    const handleCreateRequest = () => {
        console.log('Navigate to Create Request page');
    };

    const handleLogout = () => {
        console.log('Performing logout');
    };

    const handleDeleteRequest = (id: string) => {
        console.log(`Deleting request with ID: ${id}`);
        alert(`Simulating delete for request ID: ${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-semibold text-gray-700 text-center mb-6">
                    Download Requests for{' '}
                    <span className="font-bold">{userEmail}</span>
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
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.source}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div>{request.dateRange}</div>
                                            <div className="text-xs text-gray-500">{request.coords}</div>
                                            <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium">
                                                View on Map
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.requestDate}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="font-semibold">{request.status}</div>
                                            <div className="text-xs text-gray-500">{request.statusDate}</div>
                                            <div className="text-xs text-gray-500">{request.downloadInfo}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <Button
                                                onClick={() => handleDeleteRequest(request.id)}
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