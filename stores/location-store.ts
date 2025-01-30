import { create } from 'zustand';

type LocationStore = {
    locationId: number;
    retrieveLocation: (locationId: number) => void;
}

const useLocationStore = create<LocationStore>((set) => ({
    locationId: 0,
    retrieveLocation: (locationId) => set({ locationId: locationId }),
}));

export default useLocationStore;