'use client'

import { useState } from "react";
import { Info } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function ExportData() {
    const [startDate, setStartDate] = useState("2025-03-14");
    const [endDate, setEndDate] = useState("2025-03-17");

    return (
        <section className="">
            {/* Main Content */}
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold text-[#05b15d]">Export Data as CSV</h2>

                {/* Warning Box */}
                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mt-4 flex gap-2">
                    <Info className="text-xl" />
                    <p>
                        <strong>All data are uncorrected values</strong>
                        <br />
                        All air quality parameters exported are raw values. We recommend applying
                        correction algorithms. See more at{" "}
                        <a href="#" className="text-blue-600 underline">
                            Correction Algorithms
                        </a>
                        .
                    </p>
                </div>

                {/* Filters */}
                <div className="mt-6 flex flex-wrap gap-4">
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Locations</SelectLabel>
                                <SelectItem value="apple">KINAQ Kimwenza</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
                                <SelectItem value="blueberry">Blueberry</SelectItem>
                                <SelectItem value="grapes">Grapes</SelectItem>
                                <SelectItem value="pineapple">Pineapple</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select data" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="apple">Raw Data</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Date Inputs */}
                <div className="mt-4 flex flex-wrap gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border p-2 rounded-md w-full focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">End date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>
                </div>

                {/* Download Button */}
                <button className="mt-6 bg-orange-500 text-white py-2 px-6 rounded-md text-lg font-semibold hover:bg-orange-600">
                    Download
                </button>
            </div>
        </section>
    );
}
