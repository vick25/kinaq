import { LocationDetails } from "@/components/location-details"
import MapComponent from "@/components/map"
import { fetchAllAirGradientData } from "@/actions/airGradientData"

export default async function Home() {
  const gradientData = await fetchAllAirGradientData() || [];

  return (
    <div className="flex flex-col md:flex-row flex-1">
      <div className="w-full h-screen md:h-auto md:flex-1 bg-[#d9d9d9]">
        <MapComponent gradientData={gradientData} />
      </div>
      <aside className="w-full md:w-96">
        <LocationDetails />
      </aside>
    </div>
  )
}

