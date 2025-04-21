import { Suspense } from 'react';
import SensorReadings from './sensor-readings';

export const metadata = {
    title: 'KINAQ | Zones',
    description: 'Zone areas with air quality sensor from KINAQ',
}

const Districts = async () => {
    return (
        <div className='container mx-auto px-4 py-12'>
            <Suspense fallback={<div className="container mx-auto p-8 text-center">Loading sensor data...</div>}>
                <SensorReadings />
            </Suspense>
        </div>
    );
}

export default Districts;