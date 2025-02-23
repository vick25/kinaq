'use client'
// import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Droplets, Thermometer } from "lucide-react"
import Image from "next/image"
import useLocationStore from "../stores/location-store"
import { useEffect, useMemo, useState } from "react"
import { fetchLocationData } from "@/actions/airGradientData"
import LocationGauge from "./location-gauge"
import { toast } from "react-fox-toast"
import { AQI, COLORS, ILocationData } from "@/lib/definitions"
import { calculateOverallAqi, formatDateToLocaleString, formatTo2Places, getAqiDescription } from "@/lib/utils"

export default function LocationDetails() {
  const { locationId } = useLocationStore(); // Get locationId from store
  const [loading, setLoading] = useState<boolean>(false)
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

  const AQIData = useMemo(() => {
    if (locationData) {
      return calculateOverallAqi(locationData);
    }
  }, [locationData])

  return (
    <div className="w-96 border-l bg-background p-4 flex flex-col h-full">
      {loading ? <div>Loading ...</div> :
        locationData ?
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Location details</h2>
              <div className="flex justify-between items-center gap-3 text-sm text-muted-foreground">
                <p>{locationData?.locationName}</p>
                <p className="text-xs">{formatDateToLocaleString(locationData?.timestamp)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Air Quality Index</span>
                <span className="font-bold">{AQIData?.Overall_AQI}</span>
              </div>
              <LocationGauge
                value={Math.round(AQIData?.Overall_AQI || 0)}
                label={getAqiDescription(AQIData?.Overall_AQI || 0).category}
                limits={[
                  { value: 50, color: COLORS.green },
                  { value: 100, color: COLORS.yellow },
                  { value: 150, color: COLORS.orange },
                  { value: 200, color: COLORS.red },
                  { value: 300, color: COLORS.purple },
                  { value: 301, color: COLORS.maroon },
                ]}
                min={0}
                max={500}
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
                  <div className="text-2xl font-bold">{formatTo2Places(locationData?.atmp)} °C</div>
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
                  <div className="text-2xl font-bold">{formatTo2Places(locationData?.rhum)} %</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Pollutants</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>PM01</span>
                  <span>{formatTo2Places(locationData?.pm01)} μg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span>PM2.5</span>
                  <span>{formatTo2Places(locationData?.pm02)} μg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span>PM10</span>
                  <span>{formatTo2Places(locationData?.pm10)} μg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span>NO2</span>
                  <span>{formatTo2Places(locationData?.noxIndex)} ppb</span>
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
      <footer className="mt-auto pt-6">
        <Separator className="mt-4" />
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
            <div className="flex justify-center items-center space-x-2">
              <Image
                src="/logo-westerveltgroup.png"
                alt="Partner Logo 2"
                width={100}
                height={50}
                className="h-12 w-auto p-1 object-contain"
              />
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground">© Copyright WASARU {new Date().getFullYear()}</div>
      </footer>
    </div>
  )
}