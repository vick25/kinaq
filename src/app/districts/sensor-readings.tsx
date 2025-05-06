"use client";

import LocationGauge from "@/components/location-gauge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { COLORS, ILocationData } from "@/lib/definitions";
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";

const MapLocation = dynamic(() => import('./map-location'), { ssr: false });

import { fetchUniqueLocation } from "@/actions/airGradientData";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { calculateOverallAqi, formatDateToLocaleString, getAqiDescription } from "@/lib/utils";
import useLocationStore from "@/stores/location-store";
import { useLocale } from 'next-intl';
import Link from "next/link";

interface ILocation {
    locationName: string;
    locationID: string;
    latitude: string | null;
    longitude: string | null;
}

const SensorReadings = () => {
    const locale = useLocale();
    const { data: session } = authClient.useSession();

    const { locationId, locations } = useLocationStore();
    const [locationName, setLocationName] = useState("");
    const [currentLocation, setCurrentLocation] = useState<ILocation | undefined>();
    const [sensorData, setSensorData] = useState<ILocationData>();

    useEffect(() => {
        if (locationId && locations.length > 0) {
            const selectedLocation = locations.find(loc => loc.locationID === locationId.toString());
            if (selectedLocation) {
                setLocationName(selectedLocation.locationName);
                setCurrentLocation(selectedLocation);
            }
        }
    }, [locations, locationId]);

    useEffect(() => {
        const selectedLocation = locations.find(loc => loc.locationName === locationName);
        if (!selectedLocation) return;

        const fetchLocationData = async () => {
            const idToFetch = selectedLocation.locationID;
            const data = await fetchUniqueLocation(idToFetch);
            setSensorData(data);
            setCurrentLocation(selectedLocation);
        };

        fetchLocationData();
    }, [locationName, locations]);

    const AQIData = sensorData ? calculateOverallAqi(sensorData) : undefined;

    const handleLocationChange = (locationId: string) => {
        const selectedLocation = locations.find(loc => loc.locationID === locationId);
        if (selectedLocation) {
            setLocationName(selectedLocation.locationName);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div>
                <Select
                    onValueChange={handleLocationChange}
                    value={currentLocation?.locationID ?? ""}
                >
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Locations</SelectLabel>
                            {locations.map((location) => (
                                <SelectItem
                                    key={location.locationID}
                                    value={location.locationID}
                                >
                                    {location.locationName}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <hr className="border-[#05b15d] my-8" />

            <h1 className="mb-6 text-3xl font-bold text-gray-900">{locationName}</h1>

            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h2 className="mb-2 text-xl font-semibold text-gray-800">Current Readings</h2>
                    {sensorData?.timestamp ? (
                        <time className="text-gray-600">
                            Last Updated: {formatDateToLocaleString(locale, sensorData.timestamp)}
                        </time>
                    ) : (
                        <time className="text-gray-400">Loading...</time>
                    )}
                </div>

                <div className="mt-4 flex md:justify-end">
                    {session?.user && (
                        <Button className="bg-green-600 hover:bg-green-700" asChild>
                            <Link href={`/historical?locq=${locationName}`}>
                                View Historical Data
                            </Link>
                        </Button>
                    )}
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
                            <polyline points="6 9 6 2 18 2 18 9" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <rect x="6" y="14" width="12" height="8" />
                        </svg>
                    </Button>
                </div>
            </div>

            <Card className="mb-12 overflow-hidden border border-gray-200">
                <CardContent className="p-4 sm:p-6 flex flex-col lg:flex-row gap-8">
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

                    <div className="w-full lg:w-2/3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { label: 'PM1', value: sensorData?.pm01, unit: 'μg/m³' },
                                { label: 'PM2.5', value: sensorData?.pm02, unit: 'μg/m³' },
                                { label: 'PM10', value: sensorData?.pm10, unit: 'μg/m³' },
                                { label: 'CO2', value: sensorData?.rco2, unit: '' },
                                { label: 'Nitrogen Dioxide', value: sensorData?.noxIndex, unit: 'ppb' },
                                { label: 'Temperature', value: sensorData?.atmp, unit: '°C' },
                                { label: 'Humidity', value: sensorData?.rhum, unit: '%' },
                            ].map(({ label, value, unit }) => (
                                <div key={label} className="rounded-lg bg-gray-50 p-4 text-center">
                                    <h4 className="mb-2 text-xs sm:text-sm lg:text-base font-medium text-gray-700">{label}</h4>
                                    <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 truncate">
                                        {value ?? '-'}{unit && `\u00A0${unit}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {currentLocation?.latitude && currentLocation?.longitude && (
                <div className="mb-12 relative">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800">Sensor Location</h2>
                    <div className="h-[400px] w-full overflow-hidden rounded-lg border border-gray-200">
                        <div className="relative h-full w-full bg-gray-200">
                            <MapLocation
                                key={`${currentLocation.latitude}-${currentLocation.longitude}`}
                                latitude={currentLocation.latitude}
                                longitude={currentLocation.longitude}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SensorReadings;