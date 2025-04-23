import LocationDetails from "@/components/location-details";
import MapComponent from "@/components/map";
import { fetchKinAQData } from "@/actions/airGradientData";
import { IAirGradientPointData } from "@/lib/definitions";
import React from "react";
import { populateLocationsTable } from "@/actions/populateTables";

export const revalidate = 60;

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row flex-1">
      <div className="w-full h-screen md:h-auto md:flex-1 bg-[#d9d9d9]">
        <React.Suspense fallback={<FallbackMap />}>
          <MapContent />
        </React.Suspense>
      </div>
      <aside className="w-full md:w-96">
        <LocationDetails />
      </aside>
    </div>
  )
};

async function MapContent() {
  await populateLocationsTable();
  const gradientData = (await fetchKinAQData()) || [];
  return (
    <MapComponent gradientData={gradientData as IAirGradientPointData[]} />
  )
};

const FallbackMap = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="animate-pulse relative w-full h-full">
        {/* Map container skeleton */}
        <div className="w-full h-full bg-gray-200 rounded-md relative">
          {/* Placeholder for controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
            <div className="w-8 h-20 bg-gray-300 rounded"></div>
          </div>

          {/* Centered placeholder for markers */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400">Map loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
};