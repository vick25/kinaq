import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Location = {
    id: number;
    latitude: string | null;
    longitude: string | null;
    locationName: string;
    locationID: string;
}

interface LocationStore {
    locationId: number;
    coordinates: number[];
    isMapUpdated: boolean;
    locations: Location[];
    setIsMapUpdated: (mapUpdate: boolean) => void;
    retrieveLocation: (locationId: number, coordinates: number[]) => void;
    setLocations: (data: Location[]) => void;
}

const useLocationStore = create<LocationStore>()(
    persist(
        (set) => ({
            locationId: 0,
            coordinates: [],
            isMapUpdated: false,
            locations: [],
            setIsMapUpdated: (isMapUpdated) => set({ isMapUpdated }),
            retrieveLocation: (locationId, coordinates) => set({ locationId, coordinates }),
            setLocations: (data) => set({ locations: data }),
        }),
        {
            name: 'locationStorage',
        }
    )
);

export default useLocationStore;