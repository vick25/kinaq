"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LocationGauge from "@/components/location-gauge";
import { COLORS, ILocationData } from "@/lib/definitions";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getLocations } from "@/actions/populateTables";
import { fetchUniqueLocation } from "@/actions/airGradientData";
import { calculateOverallAqi, formatDateToLocaleString, getAqiDescription } from "@/lib/utils";
import useLocationStore from "@/stores/location-store";

type Props = {}

interface Location {
    id: number;
    locationName: string;
    locationID: string;
}

const SensorReadings = (props: Props) => {
    const searchParams = useSearchParams();
    const { locationId } = useLocationStore();
    const [locations, setLocations] = useState<Location[]>([]);
    const [locationName, setLocationName] = useState("");
    const [sensorData, setSensorData] = useState<ILocationData>();

    useEffect(() => {
        const fetchLocationNames = async () => {
            const data = await getLocations();
            setLocations(data);
        };

        fetchLocationNames();
    }, []);

    // Handle setting location name whenever locations or locationId changes
    useEffect(() => {
        if (locationId && locations.length > 0) {
            const selectedLocation = locations.find(loc => loc.locationID === locationId.toString());
            if (selectedLocation) {
                setLocationName(selectedLocation.locationName);
            }
        }
    }, [locations, locationId]);

    useEffect(() => {
        const selectedLocation = locations.find(loc => loc.locationName === locationName);
        const fetchLocationData = async () => {
            const data = await (locationId ? fetchUniqueLocation(locationId.toString()) :
                fetchUniqueLocation(selectedLocation?.locationID as string));
            setSensorData(data);
        };

        fetchLocationData();
    }, [locationId, locationName]);

    const AQIData = useMemo(() => {
        if (sensorData) {
            return calculateOverallAqi(sensorData);
        }
    }, [sensorData]);

    const handleLocationChange = (locationId: string) => {
        const selectedLocation = locations.find(loc => loc.locationID === locationId);
        if (selectedLocation) {
            setLocationName(selectedLocation.locationName);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div>
                <Select onValueChange={handleLocationChange}
                    value={locations.find(loc => loc.locationName === locationName)?.locationID}
                    defaultValue={locations.find(loc => loc.locationName === locationName)?.locationID}>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Locations</SelectLabel>
                            {locations.map((location) => (
                                <SelectItem
                                    key={location.id}
                                    value={location.locationID}
                                >
                                    {location.locationName}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <hr className="border-teal-300 my-8" />

            <h1 className="mb-6 text-3xl font-bold text-gray-900">{locationName}</h1>

            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h2 className="mb-2 text-xl font-semibold text-gray-800">Current Readings</h2>
                    <p className="text-gray-600">Last Updated: {formatDateToLocaleString(sensorData?.timestamp || "")}</p>
                </div>

                <div className="mt-4 flex md:justify-end">
                    {/* session?.user &&  */}
                    {<Link href={`/historical`}>
                        <Button className="bg-green-600 hover:bg-green-700">View Historical Data</Button>
                    </Link>
                    }

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
                <CardContent className="p-4 sm:p-6 flex flex-col lg:flex-row gap-8">
                    {/* Air Quality Index Gauge */}
                    <div className="w-full lg:w-1/3 flex justify-center items-center">
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

                    {/* Air Quality Readings Grid */}
                    <div className="w-full lg:w-2/3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {/* PM1 */}
                            <div className="rounded-lg bg-gray-50 p-4 text-center">
                                <h4 className="mb-2 text-sm sm:text-base lg:text-lg font-medium text-gray-700">PM1</h4>
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{sensorData?.pm01}&nbsp;μg/m³</p>
                            </div>

                            {/* PM2.5 */}
                            <div className="rounded-lg bg-gray-50 p-4 text-center">
                                <h4 className="mb-2 text-sm sm:text-base lg:text-lg font-medium text-gray-700">PM2.5</h4>
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{sensorData?.pm02}&nbsp;μg/m³</p>
                            </div>

                            {/* PM10 */}
                            <div className="rounded-lg bg-gray-50 p-4 text-center">
                                <h4 className="mb-2 text-sm sm:text-base lg:text-lg font-medium text-gray-700">PM10</h4>
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{sensorData?.pm10}&nbsp;μg/m³</p>
                            </div>

                            {/* CO2 */}
                            <div className="rounded-lg bg-gray-50 p-4 text-center">
                                <h4 className="mb-2 text-sm sm:text-base lg:text-lg font-medium text-gray-700">CO2</h4>
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{sensorData?.rco2}</p>
                            </div>

                            {/* Nitrogen Dioxide */}
                            <div className="rounded-lg bg-gray-50 p-4 text-center">
                                <h4 className="mb-2 text-sm sm:text-base lg:text-lg font-medium text-gray-700">Nitrogen Dioxide</h4>
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{sensorData?.noxIndex}&nbsp;ppb</p>
                            </div>

                            {/* Temperature */}
                            <div className="rounded-lg bg-gray-50 p-4 text-center">
                                <h4 className="mb-2 text-sm sm:text-base lg:text-lg font-medium text-gray-700">Temperature</h4>
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{sensorData?.atmp}&nbsp;°C</p>
                            </div>

                            {/* Humidity */}
                            <div className="rounded-lg bg-gray-50 p-4 text-center">
                                <h4 className="mb-2 text-sm sm:text-base lg:text-lg font-medium text-gray-700">Humidity</h4>
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{sensorData?.rhum}&nbsp;%</p>
                            </div>
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