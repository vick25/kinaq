'use client'
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Thermometer } from "lucide-react"
import Image from "next/image"
import useLocationStore from "../../stores/location-store"

export function LocationDetails() {
  const { locationId } = useLocationStore(); // Get locationId from store

  // const agLocationData = await fetchLocationData(`${locationId}`); // Fetch location data
  // console.log(agLocationData)

  return (
    <div className="w-96 border-l bg-background p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Location Details</h2>
          <p className="text-sm text-muted-foreground">Lorem ipsum</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Air Quality Index</span>
            <span className="font-bold">42</span>
          </div>
          <Progress value={42} className="h-2" />
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
              <div className="text-2xl font-bold">24 °C</div>
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
              <div className="text-2xl font-bold">65 %</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Pollutants</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>PM2.5</span>
              <span>15 μg/m³</span>
            </div>
            <div className="flex justify-between">
              <span>PM10</span>
              <span>25 μg/m³</span>
            </div>
            <div className="flex justify-between">
              <span>NO2</span>
              <span>18 ppb</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Weekly Forecast</h3>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Our Partners</h3>
          <div className="flex flex-col justify-center space-y-2">
            <div className="flex justify-center items-center space-x-4">
              <Image
                src="/logo-wasaru.jpg"
                alt="Partner Logo 1"
                width={100}
                height={50}
                className="h-32 w-auto object-contain"
              />
              <Image
                src="/logo-epic.png"
                alt="Partner Logo 2"
                width={500}
                height={500}
                className="h-40 w-auto object-cover"
              />
            </div>
            <Image
              src="/logo-westerveltgroup.png"
              alt="Partner Logo 2"
              width={100}
              height={50}
              className="h-12 w-auto object-contain"
            />
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">© Copyright WASARU 2024</div>
      </div>
    </div>
  )
}

