'use client'
// import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Droplets, Thermometer } from "lucide-react"
import Image from "next/image"
import useLocationStore from "../stores/location-store"
import { useEffect, useMemo, useState } from "react"
import { fetchLocationData, fetchUniqueLocation } from "@/actions/airGradientData"
import LocationGauge from "./location-gauge"
import { toast } from "react-fox-toast"
import { COLORS, ILocationData } from "@/lib/definitions"
import { calculateOverallAqi, formatDateToLocaleString, formatTo2Places, getAqiDescription } from "@/lib/utils"
import Link from "next/link";
import { useLocale } from 'next-intl';

export default function LocationDetails() {
  const locale = useLocale();
  const { locationId, isMapUpdated, setIsMapUpdated } = useLocationStore(); // Get locationId from store
  // const [loading, setLoading] = useState<boolean>(false)
  const [locationData, setLocationData] = useState<ILocationData>();
  const [offline, setOffline] = useState<boolean>(false);

  useEffect(() => {
    // Fetch location data
    const agLocationData = async () => {
      // setLoading(true);
      try {
        const response = await fetchLocationData(`${locationId}`);

        // If the response was unsuccessful then get the last location data
        if (response === null) {
          const response = await fetchUniqueLocation(`${locationId}`);
          setLocationData(response);
          setOffline(true);
          return;
        }
        toast.promise(
          Promise.resolve(response), // Wrap the data in a resolved promise
          {
            loading: "Loading data...",
            success: "Data processed successfully!",
            error: "Failed to load data!",
            position: "top-right",
          }
        );
        setLocationData(response);
        setOffline(false);
        // setLoading(false);
      } catch (error) {
        console.error("Error in agLocationData:", error);
        toast.error("Failed to load data!"); // Display an error toast
        // setLoading(false);
      }
    };

    if (locationId) {
      agLocationData();
      setIsMapUpdated(false);
    }
  }, [locationId, isMapUpdated, setIsMapUpdated]);

  const AQIData = useMemo(() => {
    if (locationData) {
      return calculateOverallAqi(locationData);
    }
  }, [locationData])

  return (
    <div className="w-96 border-l bg-background p-4 flex flex-col h-full">
      {
        // loading ? <div>Loading ...</div> :
        locationData ?
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold mb-2">Location details</h2>
              <div className="flex justify-between items-center gap-3 text-sm text-muted-foreground">
                <p className="relative flex items-center">{locationData?.locationName}
                  {offline &&
                    <><span className="absolute -top-1 -right-3 flex size-3 cursor-pointer" title="The sensor seems to be offline.">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
                    </span>
                      <span className="absolute -top-[0.37rem] -right-[1.9rem] text-red-600 text-xs font-semibold">off</span>
                    </>}
                </p>
                <time className="text-xs">{formatDateToLocaleString(locale, locationData?.timestamp)}</time>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Air Quality Index</span>
                <span className="text-xl font-bold">{AQIData?.Overall_AQI}</span>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="flex items-center text-sm font-medium">
                    <Thermometer className="mr-2 h-4 w-4" />
                    Temperature
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-lg font-bold">{formatTo2Places(locationData?.atmp)} °C</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="flex items-center text-sm font-medium">
                    <Droplets className="mr-2 h-4 w-4" />
                    Humidity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-lg font-bold">{formatTo2Places(locationData?.rhum)} %</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Pollutants</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>PM01</span>
                  <p><span className="font-semibold">{formatTo2Places(locationData?.pm01)}</span>&nbsp;μg/m³</p>
                </div>
                <div className="flex justify-between">
                  <span>PM2.5</span>
                  <p><span className="font-semibold">{formatTo2Places(locationData?.pm02)}</span>&nbsp;μg/m³</p>
                </div>
                <div className="flex justify-between">
                  <span>PM10</span>
                  <p><span className="font-semibold">{formatTo2Places(locationData?.pm10)}</span>&nbsp;μg/m³</p>
                </div>
                <div className="flex justify-between">
                  <span>NO2</span>
                  <p><span className="font-semibold">{formatTo2Places(locationData?.noxIndex)}</span>&nbsp;ppb</p>
                </div>
              </div>
            </div>
          </div> :
          <div className="text-sm">No data found. Click on a location !</div>
      }
      <footer className="mt-auto pt-5">
        <Separator className="mt-4" />
        <div className="space-y-4">
          <h3 className="font-semibold mt-2">Our Partners</h3>
          <div className="flex flex-col justify-center space-y-2">
            <div className="flex justify-center items-center space-x-2">
              <Link href="https://wasaruwash.org/" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/logo-wasaru.jpg"
                  alt="Partner Logo 1"
                  width={100}
                  height={50}
                  className="h-24 w-auto object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                  priority
                />
              </Link>
              <Link href="https://epic.uchicago.edu/area-of-focus/clean-air-program/" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/logo-epic.png"
                  alt="Partner Logo 2"
                  width={100}
                  height={50}
                  className="h-16 w-auto object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                  priority
                />
              </Link>
            </div>
            <div className="flex justify-center items-center space-x-2">
              <Link href="https://aerosol.ldeo.columbia.edu/" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/logo-westerveltgroup.png"
                  alt="Partner Logo 2"
                  width={100}
                  height={50}
                  className="h-12 w-auto p-1 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                  priority
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground">© Copyright WASARU {new Date().getFullYear()}</div>
      </footer>
    </div>
  )
}