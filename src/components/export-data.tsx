'use client';

import { useEffect, useState } from "react";
import { Info, Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link";
import { fetchKinAQData, fetchLocationMeasures } from "@/actions/airGradientData";
import { convertToCSV, formatToYYYYMMDD } from "@/lib/utils";
import { ILocationMeasure, Usages } from "@/lib/definitions";

type Props = {
    locationQuery: string;
}
type LocationData = {
    locationName: string;
    locationId: string;
}

export default function ExportData({ locationQuery }: Props) {
    const [startDate, setStartDate] = useState<string | undefined>();
    const [endDate, setEndDate] = useState<string | undefined>();
    const [locationsData, setLocationsData] = useState<LocationData[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string | undefined>();
    const [selectedBucket, setSelectedBucket] = useState<string | undefined>();
    const [institution, setInstitution] = useState<string>('');
    const [selectedUsage, setSelectedUsage] = useState<Usages | undefined>(Usages.academic_research);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloadDisabled, setIsDownloadDisabled] = useState(true);

    const handleDownload = async (format: 'csv' | 'json') => {
        if (!selectedLocation || !selectedBucket) {
            console.error("Missing required parameters for download.");
            alert("Please select location, bucket.");
            return;
        }

        if (selectedBucket === 'past' && (!startDate || !endDate)) {
            alert("Please select a start and end date.");
            return;
        }

        if (endDate! < startDate!) {
            alert("End date cannot be earlier than the start date.");
            return;
        }

        setIsLoading(true);

        try {
            //Generate Filename
            const datePart = (startDate && endDate) ?
                `${formatToYYYYMMDD(startDate as string)}-${formatToYYYYMMDD(endDate as string)}` :
                new Date().toISOString().split('T')[0];
            const locationNamePart = locationsData.find(loc => loc.locationId === selectedLocation)?.locationName.replace(/\s+/g, '_') || selectedLocation;  // Use name or ID
            const baseFilename = `Export_${locationNamePart}_${selectedBucket}_${datePart.replace(/-/g, '_')}`;

            // Fetch data from the API
            const data: ILocationMeasure[] = await fetchLocationMeasures(`locations/${selectedLocation}/measures/${selectedBucket}`,
                startDate as string, endDate as string);

            if (data) {
                if (format === 'csv') {
                    const csvData = convertToCSV(data);
                    triggerFileDownload(csvData, `${baseFilename}.csv`, 'text/csv;charset=utf-8;');
                } else if (format === 'json') {
                    const jsonData = JSON.stringify(data, null, 2); // Pretty print JSON
                    triggerFileDownload(jsonData, `${baseFilename}.json`, 'application/json;charset=utf-8;');
                }

                // Update database after successful download
                try {
                    const response = await fetch('/api/export-data', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
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

                    if (!response.ok) {
                        throw new Error('Failed to update database');
                    }
                } catch (error) {
                    console.error('Error updating database:', error);
                }
            } else {
                console.error("No data returned from the API.");
            }
        } catch (error) {
            // Error already logged and message set in fetchExportData
            console.error(`Download failed for ${format.toUpperCase()}:`, error);
            // Error message state is already set by fetchExportData, no need to alert again unless desired
            // alert(`Failed to download data: ${errorMessage || 'Unknown error'}`);
        } finally {
            setIsLoading(false); // Stop loading indicator regardless of success or failure
        }
    }

    // Handle End Date Change - includes validation against start date
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEndDate = e.target.value;

        // Prevent setting end date if it's earlier than the start date
        if (startDate && newEndDate < startDate) {
            alert("End date cannot be earlier than the start date.");
            // Optionally reset the input visually if needed: 
            e.target.value = endDate || '';
        } else {
            setEndDate(newEndDate);
        }
    };

    /**
       * Triggers a browser file download.
    */
    const triggerFileDownload = (content: string, filename: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a); // Append link to body
        a.click(); // Programmatically click the link
        document.body.removeChild(a); // Remove link from body
        URL.revokeObjectURL(url); // Release the object URL
    };

    const getLocationData = async () => {
        try {
            const data = await fetchKinAQData();
            if (data) {
                const locations: LocationData[] = data.map((location: LocationData) => ({
                    locationName: location.locationName,
                    locationId: location.locationId,
                }));
                setLocationsData(locations);
            } else {
                console.error("Failed to fetch data");
            }
        } catch (error) {
            console.error("Failed to fetch location data:", error);
        }
    };

    useEffect(() => {
        getLocationData();
    }, []);

    // Effect to update download button disable state
    useEffect(() => {
        // Enable button only if both location and bucket are selected
        if (selectedLocation && selectedBucket) {
            setIsDownloadDisabled(false);
        } else {
            setIsDownloadDisabled(true);
        }
    }, [selectedLocation, selectedBucket]);

    return (
        <section className="pb-10">
            {/* Main Content */}
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold text-[#05b15d]">Export Data as CSV</h2>

                {/* Warning Box */}
                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mt-4 flex gap-2">
                    <Info className="text-xl" />
                    <p className="text-sm">
                        <strong>All data are uncorrected values</strong>
                        <br />
                        All air quality parameters exported are raw values. We recommend applying
                        correction algorithms. See more at{" "}
                        <Link href="https://www.airgradient.com/documentation/correction-algorithms/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                            Correction Algorithms
                        </Link>.
                    </p>
                </div>

                {/* Filters */}
                <div className="mt-6 flex items-center flex-wrap gap-4">
                    <Select
                        value={locationsData.find(loc => loc.locationName === locationQuery)?.locationId}
                        //   defaultValue={locationsData.find(loc => loc.locationName === locationName)?.locationID}
                        onValueChange={(value) => setSelectedLocation(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Locations</SelectLabel>
                                {locationsData.length > 0 ? (
                                    locationsData.map((location) => (
                                        <SelectItem value={location.locationId} key={location.locationId}>{location.locationName}</SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="loading" disabled>Loading locations...</SelectItem>
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(value) => setSelectedBucket(value)}>
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

                {/* Date Inputs */}
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
                    <legend className="text-base font-semibold text-gray-600 px-2">
                        Usage Information
                    </legend>

                    {/* Institution Input */}
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
                            placeholder="e.g., University of Example, Example Corp"
                        />
                    </div>

                    {/* Usage Radio Buttons */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Primary Usage
                        </label>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2">
                            {/* Layout radios */}
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

                <button className={`mt-6 bg-orange-500 text-white py-2 px-6 rounded-md text-lg font-semibold hover:bg-orange-600
                                ${isDownloadDisabled ? 'opacity-50 cursor-not-allowed' : ''} `}
                    onClick={() => handleDownload('csv')}>
                    {isLoading ? (
                        <div className="flex items-center justify-between">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Downloading...
                        </div>
                    ) : (
                        'Download'
                    )}
                </button>
            </div>
        </section>
    );
}
