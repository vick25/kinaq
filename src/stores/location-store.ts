import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LocationStore = {
    locationId: number;
    coordinates: number[];
    isMapUpdated: boolean;
    setIsMapUpdated: (mapUpdate: boolean) => void;
    retrieveLocation: (locationId: number, coordinates: number[]) => void;
}

const useLocationStore = create<LocationStore>()(
    persist(
        (set) => ({
            locationId: 0,
            coordinates: [],
            isMapUpdated: false,
            setIsMapUpdated: (isMapUpdated) => set({ isMapUpdated }),
            retrieveLocation: (locationId, coordinates) => set({ locationId, coordinates }),
        }),
        {
            name: 'locationStorage',
        }
    )
);

export default useLocationStore;