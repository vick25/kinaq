'use client';

import { fetchLocationMeasures } from "@/actions/airGradientData";
import {
    Select, SelectContent, SelectGroup, SelectItem,
    SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ILocationMeasure, Usages } from "@/lib/definitions";
import { convertToCSV, formatToYYYYMMDD } from "@/lib/utils";
import useLocationStore from "@/stores/location-store";
import { Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";

type Props = {
    locationQuery: string;
};

export default function ExportData({ locationQuery }: Props) {
    const { locationId, locations } = useLocationStore();

    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const [selectedLocation, setSelectedLocation] = useState<string>();
    const [selectedBucket, setSelectedBucket] = useState<string>();
    const [institution, setInstitution] = useState<string>('');
    const [selectedUsage, setSelectedUsage] = useState<Usages>(Usages.academic_research);
    const [isLoading, setIsLoading] = useState(false);

    const isDownloadDisabled = !selectedLocation || !selectedBucket;

    const selectedLocationName = useMemo(() => {
        return locations.find(loc => loc.locationID === selectedLocation)?.locationName ?? selectedLocation;
    }, [locations, selectedLocation]);

    useEffect(() => {
        if (!locations.length) return;

        const foundByQuery = locations.find(loc => loc.locationName === locationQuery);
        const foundById = locationId && locations.find(loc => loc.locationID === locationId.toString());

        if (foundByQuery) {
            setSelectedLocation(foundByQuery.locationID);
        } else if (foundById) {
            setSelectedLocation(foundById.locationID);
        }
    }, [locations, locationQuery, locationId]);

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEndDate = e.target.value;
        if (startDate && newEndDate < startDate) {
            alert("End date cannot be earlier than the start date.");
            e.target.value = endDate || '';
        } else {
            setEndDate(newEndDate);
        }
    };

    const triggerFileDownload = (content: string, filename: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownload = async (format: 'csv' | 'json') => {
        if (!selectedLocation || !selectedBucket) {
            alert("Please select location and bucket.");
            return;
        }

        if (selectedBucket === 'past' && (!startDate || !endDate)) {
            alert("Please select a start and end date.");
            return;
        }

        if (startDate && endDate && endDate < startDate) {
            alert("End date cannot be earlier than the start date.");
            return;
        }

        setIsLoading(true);

        try {
            const datePart = (startDate && endDate)
                ? `${formatToYYYYMMDD(startDate)}-${formatToYYYYMMDD(endDate)}`
                : new Date().toISOString().split('T')[0];

            const safeLocation = selectedLocationName?.replace(/\s+/g, '_');
            const filename = `Export_${safeLocation}_${selectedBucket}_${datePart.replace(/-/g, '_')}`;

            const data: ILocationMeasure[] = await fetchLocationMeasures(
                `locations/${selectedLocation}/measures/${selectedBucket}`,
                startDate ?? '', endDate ?? ''
            );

            if (!data?.length) throw new Error("No data returned from the API.");

            if (format === 'csv') {
                triggerFileDownload(convertToCSV(data), `${filename}.csv`, 'text/csv;charset=utf-8;');
            } else {
                triggerFileDownload(JSON.stringify(data, null, 2), `${filename}.json`, 'application/json;charset=utf-8;');
            }

            await fetch('/api/export-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    institution,
                    locationId: selectedLocation,
                    bucket: selectedBucket,
                    usage: selectedUsage,
                    startDate,
                    endDate,
                    format
                }),
            });
        } catch (err) {
            console.error('Export error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="pb-10">
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold text-[#05b15d]">Export Data as CSV</h2>

                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mt-4 flex gap-2">
                    <Info className="text-xl" />
                    <p className="text-sm">
                        <strong>All data are uncorrected values</strong>
                        <br />
                        Air quality parameters are raw values. Apply corrections. See{" "}
                        <Link href="https://www.airgradient.com/documentation/correction-algorithms/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                            Correction Algorithms
                        </Link>.
                    </p>
                </div>

                <div className="mt-6 flex items-center flex-wrap gap-4">
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Locations</SelectLabel>
                                {locations.map(loc => (
                                    <SelectItem key={loc.locationID} value={loc.locationID}>{loc.locationName}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select onValueChange={setSelectedBucket}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select bucket" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="raw">Raw Data</SelectItem>
                                <SelectItem value="past">Past Data</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {selectedBucket &&
                        <p className="text-xs text-red-600 ml-4">
                            {selectedBucket === 'raw' ? 'The from .. to interval is limited to 2 days.' : 'The from .. to interval is limited to 10 days.'}
                        </p>}
                </div>

                <div className="mt-4 flex items-center flex-wrap gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start date</label>
                        <input
                            type="date"
                            max={endDate}
                            value={startDate || ''}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1 border p-2 rounded-md w-full focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">End date</label>
                        <input
                            type="date"
                            min={startDate}
                            value={endDate || ''}
                            onChange={handleEndDateChange}
                            className="mt-1 border p-2 rounded-md w-full focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <fieldset className="mt-6 border border-gray-300 p-4 rounded-md">
                    <legend className="text-base font-semibold text-gray-600 px-2">Usage Information</legend>

                    <div className="mt-3">
                        <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                            Institution / Company Name
                        </label>
                        <input
                            type="text"
                            id="institution"
                            name="institution"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            className="mt-1 border p-2 rounded-md w-full focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Usage</label>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2">
                            {Object.keys(Usages)
                                .filter(key => isNaN(Number(key)))
                                .map((usageKey) => (
                                    <div key={usageKey} className="flex items-center gap-2">
                                        <input
                                            required
                                            type="radio"
                                            id={`usage-${usageKey}`}
                                            name="usage"
                                            value={usageKey}
                                            checked={selectedUsage === Usages[usageKey as keyof typeof Usages]}
                                            onChange={() => setSelectedUsage(Usages[usageKey as keyof typeof Usages])}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                        />
                                        <label htmlFor={`usage-${usageKey}`} className="text-sm text-gray-700">
                                            {Usages[usageKey as keyof typeof Usages]}
                                        </label>
                                    </div>
                                ))}
                        </div>
                    </div>
                </fieldset>

                <Button
                    className={`mt-6 bg-orange-500 text-white py-2 px-6 rounded-md text-lg font-semibold hover:bg-orange-600
                        ${isDownloadDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleDownload('csv')}
                    disabled={isDownloadDisabled}
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Downloading...
                        </div>
                    ) : 'Download'}
                </Button>
            </div>
        </section>
    );
}