import LocationDetails from "@/components/location-details"
import MapComponent from "@/components/map"
import { fetchAllAirGradientData, fetchKinAQData } from "@/actions/airGradientData"
import { IAirGradientPointData } from "@/lib/definitions";
import React from "react";
import { kinAQPoints } from "@/lib/constants";

export default async function Home() {
  // const gradientData = (await fetchAllAirGradientData()) || [];
  const gradientData = (await fetchKinAQData()) || [];

  return (
    <div className="flex flex-col md:flex-row flex-1">
      <div className="w-full h-screen md:h-auto md:flex-1 bg-[#d9d9d9]">
        <React.Suspense fallback={<p>loading map ...</p>}>
          <MapComponent gradientData={gradientData as IAirGradientPointData[]} />
        </React.Suspense>
      </div>
      <aside className="w-full md:w-96">
        <LocationDetails />
      </aside>
    </div>
  )
}