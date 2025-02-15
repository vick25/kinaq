import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LocationStore = {
    locationId: number;
    coordinates: number[];
    retrieveLocation: (locationId: number, coordinates: number[]) => void;
}

const useLocationStore = create<LocationStore>()(
    persist(
        (set) => ({
            locationId: 0,
            coordinates: [],
            retrieveLocation: (locationId, coordinates) => set({ locationId, coordinates }),
        }),
        {
            name: 'locationStorage',
        }
    )
);

export default useLocationStore;