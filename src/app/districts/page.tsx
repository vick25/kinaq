import { Card, CardContent } from "@/components/ui/card";
import React, { Suspense } from 'react';

const SensorReadings = React.lazy(() => import('./sensor-readings'));

export const metadata = {
    title: 'KINAQ | Zones',
    description: 'Zone areas with air quality sensor from KINAQ',
}

export default async function Districts() {
    return (
        <div className='container mx-auto px-4 py-12'>
            <Suspense fallback={<AQILoadingFallback />}>
                <SensorReadings />
            </Suspense>
        </div>
    );
}

async function AQILoadingFallback() {
    return (
        <Card className="mb-12 overflow-hidden border border-gray-200 animate-pulse">
            <CardContent className="p-4 sm:p-6 flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/3 flex justify-center items-center">
                    <div className="h-48 w-48 rounded-full bg-gray-200" />
                </div>
                <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {Array.from({ length: 7 }).map((_, idx) => (
                        <div key={idx} className="rounded-lg bg-gray-50 p-4 text-center">
                            <div className="h-4 w-24 mx-auto mb-2 bg-gray-200 rounded" />
                            <div className="h-8 w-16 mx-auto bg-gray-300 rounded" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}