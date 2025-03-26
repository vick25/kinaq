'use server'
import { API_URL } from '../lib/constants';
import { NextResponse } from "next/server";

export async function fetchAllAirGradientData() {
    const APIURL = `${API_URL}v1/world/locations/measures/current`;

    try {
        const response = await fetch(APIURL, {
            next: { revalidate: 60 }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch Air Gradient data. ${error}` }, { status: 500 });
    }
}

export async function fetchLocationData(locationId: string) {
    const APIURL = `${API_URL}v1/world/locations/${locationId}/measures/current`;

    try {
        const response = await fetch(APIURL);
        const data = await response.json();
        return data;
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch Air Gradient data. ${error}` }, { status: 500 });
    }
}
