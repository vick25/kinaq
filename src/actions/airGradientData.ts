'use server'
import { API_URL } from '../lib/constants';
import { NextResponse } from "next/server";

export async function fetchAllAirGradientData() {
    const APIURL = `${API_URL}v1/world/locations/measures/current`;

    try {
        const response = await fetch(APIURL, {
            next: { revalidate: 60 }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch Air Gradient data:", error);
        return null;
    }
}

export async function fetchLocationData(locationId: string) {
    const APIURL = `${API_URL}v1/world/locations/${locationId}/measures/current`;

    try {
        const response = await fetch(APIURL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch Air Gradient data:", error);
        return null;
    }
}
