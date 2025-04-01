import React, { Suspense } from 'react'
import SensorReadings from './sensor-readings';

const Districts = async () => {
    return (
        <div className='container mx-auto px-4 py-12'>
            <Suspense fallback={<div className="container mx-auto p-8 text-center">Loading sensor data...</div>}>
                <SensorReadings />
            </Suspense>
        </div>
    );
}

export default Districts