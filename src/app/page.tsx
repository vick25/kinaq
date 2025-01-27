import { Header } from "@/components/header"
import { LocationDetails } from "@/components/location-details"
import MapComponent from "@/components/map"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <div className="flex-1 bg-[#d9d9d9] p-4">
          <MapComponent />
          {/* <p className="text-center text-muted-foreground">Map view with Air Quality device points</p> */}
        </div>
        <LocationDetails />
      </div>
    </div>
  )
}

