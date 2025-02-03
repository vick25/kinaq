import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LocationStore = {
    locationId: number;
    retrieveLocation: (locationId: number) => void;
}

const useLocationStore = create<LocationStore>()(
    persist(
        (set) => ({
            locationId: 0,
            retrieveLocation: (locationId) => set({ locationId: locationId }),
        }),
        {
            name: 'locationStorage',
        }
    )
);

export default useLocationStore;