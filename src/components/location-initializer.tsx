'use client';

import useLocationStore from '@/stores/location-store';
import { useEffect } from 'react';

type Location = {
    id: number;
    latitude: string | null;
    longitude: string | null;
    locationName: string;
    locationID: string;
}

export default function LocationsInitializer({ locationsData, children }: { locationsData: Location[], children: React.ReactNode }) {
    const setLocations = useLocationStore(state => state.setLocations)

    useEffect(() => {
        setLocations(locationsData)
    }, [locationsData])

    return <>{children}</>
}