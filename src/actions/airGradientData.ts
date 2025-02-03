'use server'

import { NextResponse } from "next/server";

export async function fetchAllAirGradientData() {
    const APIURL = "https://api.airgradient.com//public/api/v1/world/locations/measures/current";

    try {
        const response = await fetch(APIURL);
        const data = await response.json();
        return data;
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch Air Gradient data. ${error}` }, { status: 500 });
    }
}

export async function fetchLocationData(locationId: string) {
    const APIURL = `https://api.airgradient.com//public/api/v1/world/locations/${locationId}/measures/current`;

    try {
        const response = await fetch(APIURL);
        const data = await response.json();
        return data;
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch Air Gradient data. ${error}` }, { status: 500 });
    }
}
