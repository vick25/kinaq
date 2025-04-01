"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LocationGauge from "@/components/location-gauge";
import { COLORS } from "@/lib/definitions";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Props = {}

interface SensorData {
    pm1: number;
    pm25: number;
    pm10: number;
    no2: number;
    temperature: number;
    humidity: number;
    aqi: number;
    aqiStatus: string;
    lastUpdated: string;
}


const SensorReadings = (props: Props) => {
    const searchParams = useSearchParams();
    const [locationName, setLocationName] = useState("Kinshasa");
    const [sensorData, setSensorData] = useState<SensorData>({
        pm1: 30,
        pm25: 31,
        pm10: 31,
        no2: 11,
        temperature: 32,
        humidity: 71,
        aqi: 91,
        aqiStatus: "Moderate",
        lastUpdated: new Date().toLocaleString()
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div>
                <Select>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Locations</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <hr className="border-teal-300 my-8" />

            <h1 className="mb-6 text-3xl font-bold text-gray-900">{locationName}</h1>

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="mb-2 text-xl font-semibold text-gray-800">Current Readings</h2>
                    <p className="text-gray-600">Last Updated: {sensorData.lastUpdated}</p>
                </div>

                <div className="mt-4 flex justify-end">
                    <Link href={`/historical`}>
                        <Button className="bg-green-600 hover:bg-green-700">View Historical Data</Button>
                    </Link>

                    <Button className="ml-2 bg-blue-500 hover:bg-blue-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                        >
                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                            <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                    </Button>
                </div>
            </div>

            <Card className="mb-12 overflow-hidden border border-gray-200">
                <CardContent className="p-6 flex flex-col md:flex-row items-center">
                    {/* Air Quality Index Gauge */}
                    <div className="mb-8 flex-1">
                        <LocationGauge
                            value={sensorData?.aqi || 0}
                            label={sensorData?.aqiStatus}
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

                    {/* Air Quality Readings Grid */}
                    <div className="flex-1 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* PM1 */}
                        <div className="rounded-lg p-4 text-center">
                            <h4 className="mb-2 text-lg font-medium text-gray-700">PM1</h4>
                            <p className="text-4xl font-bold text-gray-900">{sensorData?.pm1}</p>
                        </div>

                        {/* PM2.5 */}
                        <div className="rounded-lg p-4 text-center">
                            <h4 className="mb-2 text-lg font-medium text-gray-700">PM2.5</h4>
                            <p className="text-4xl font-bold text-gray-900">{sensorData?.pm25}</p>
                        </div>

                        {/* PM10 */}
                        <div className="rounded-lg p-4 text-center">
                            <h4 className="mb-2 text-lg font-medium text-gray-700">PM10</h4>
                            <p className="text-4xl font-bold text-gray-900">{sensorData?.pm10}</p>
                        </div>

                        {/* Nitrogen Dioxide */}
                        <div className="rounded-lg p-4 text-center">
                            <h4 className="mb-2 text-lg font-medium text-gray-700">Nitrogen Dioxide</h4>
                            <p className="text-4xl font-bold text-gray-900">{sensorData?.no2}</p>
                        </div>

                        {/* Temperature */}
                        <div className="rounded-lg p-4 text-center">
                            <h4 className="mb-2 text-lg font-medium text-gray-700">Temperature</h4>
                            <p className="text-4xl font-bold text-gray-900">{sensorData?.temperature}°C</p>
                        </div>

                        {/* Humidity */}
                        <div className="rounded-lg p-4 text-center">
                            <h4 className="mb-2 text-lg font-medium text-gray-700">Humidity</h4>
                            <p className="text-4xl font-bold text-gray-900">{sensorData?.humidity}%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sensor Location Map */}
            <div className="mb-12">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">Sensor Location</h2>
                <div className="h-[400px] w-full overflow-hidden rounded-lg border border-gray-200">
                    {/* This would be a Google Maps component in a real application */}
                    <div className="relative h-full w-full bg-gray-200">
                        <div className="absolute left-0 top-0 z-10 m-2 flex">
                            <button className="rounded-l-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Map
                            </button>
                            <button className="rounded-r-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Satellite
                            </button>
                        </div>
                        <div className="h-full w-full bg-[#e5e3df]">
                            {/* Sample map placeholder */}
                            <div className="flex h-full w-full items-center justify-center">
                                <p className="text-xl text-gray-500">Map data would appear here</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SensorReadings