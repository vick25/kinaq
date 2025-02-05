'use client'
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Thermometer } from "lucide-react"
import Image from "next/image"
import useLocationStore from "../../stores/location-store"
import { useEffect, useState } from "react"
import { fetchLocationData } from "@/actions/airGradientData"
import LocationGauge, { COLORS } from "./location-gauge"
import { toast } from "react-fox-toast"

interface ILocationData {
  locationName: string;
  publicLocationName: string;
  latitude: number;
  longitude: number;
  offline?: boolean;
  pm01: number;
  pm02: number;
  pm10: number;
  pm003Count: number;
  atmp: number;
  rhum: number
  rco2: number;
  tvoc: number;
  wifi: number;
  timestamp: string;
  tvocIndex: number;
  noxIndex: number;
  heatindex: number;
  publicPlaceName?: null;
  publicPlaceUrl?: null;
  publicContributorName?: null;
  timezone: string;
  model?: string;
  firmwareVersion?: string
  locationId: number;
}

export default function LocationDetails() {
  const { locationId } = useLocationStore(); // Get locationId from store
  const [Loading, setLoading] = useState<boolean>(false)
  const [locationData, setLocationData] = useState<ILocationData>()

  // Fetch location data
  const agLocationData = async () => {
    setLoading(true)
    const response = await fetchLocationData(`${locationId}`)
    // toast.promise(response, {
    //   loading: 'Loading data...',
    //   success: 'Data loaded successfully!',
    //   error: 'Failed to load data!',
    //   position: 'top-center'
    // })
    if (response.error) {
      toast.error(response.error)
      setLoading(false)
      return
    }
    setLocationData(response)
    setLoading(false)
  };

  useEffect(() => {
    agLocationData()
  }, [locationId])

  return (
    <div className="w-96 border-l bg-background p-4">
      {Loading ? <div>Loading ...</div> :
        locationData ?
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Location Details</h2>
              <div className="flex justify-between gap-3 text-sm text-muted-foreground">
                <p>{locationData?.locationName}</p>
                <p>{new Date(locationData?.timestamp).toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Air Quality Index</span>
                <span className="font-bold">{locationData?.pm02} μg/m³</span>
              </div>
              <LocationGauge
                value={Math.round(locationData?.pm02)}
                limits={[
                  { value: 12, color: COLORS.green },
                  { value: 35.4, color: COLORS.lightBlue },
                  { value: 55.4, color: COLORS.orange },
                  { value: 150.4, color: COLORS.red },
                  { value: 200, color: COLORS.purple },
                ]}
                min={0}
                max={200}
              />
              {/* <Progress value={Math.round(locationData?.pm02)} className="h-2" /> */}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-sm font-medium">
                    <Thermometer className="mr-2 h-4 w-4" />
                    Temperature
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{locationData?.atmp} °C</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-sm font-medium">
                    <Droplets className="mr-2 h-4 w-4" />
                    Humidity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{locationData?.rhum} %</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Pollutants</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>PM2.5</span>
                  <span>{locationData?.pm02} μg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span>PM10</span>
                  <span>{locationData?.pm10} μg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span>NO2</span>
                  <span>{locationData?.noxIndex} ppb</span>
                </div>
              </div>
            </div>

            {/* <div className="space-y-4">
              <h3 className="font-semibold">Weekly Forecast</h3>
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>
            </div> */}
          </div> :
          <div>No data found!</div>
      }

      <footer className="space-y-12 mt-8 border-t-2">
        <div className="space-y-4">
          <h3 className="font-semibold mt-2">Our Partners</h3>
          <div className="flex flex-col justify-center space-y-2">
            <div className="flex justify-center items-center space-x-2">
              <Image
                src="/logo-wasaru.jpg"
                alt="Partner Logo 1"
                width={100}
                height={50}
                className="h-24 w-auto object-contain"
              />
              <Image
                src="/logo-epic.png"
                alt="Partner Logo 2"
                width={100}
                height={50}
                className="h-16 w-auto object-contain"
              />
            </div>
            <Image
              src="/logo-westerveltgroup.png"
              alt="Partner Logo 2"
              width={100}
              height={50}
              className="h-12 w-auto p-1 object-contain"
            />
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground">© Copyright WASARU {new Date().getFullYear()}</div>
      </footer>
    </div>
  )
}