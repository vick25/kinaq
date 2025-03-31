'use server'
import { API_URL } from '../lib/constants';
import { NextResponse } from "next/server";

const AIRGRADIENT_TOKEN = process.env.AIRGRADIENT_TOKEN;

export async function fetchAllAirGradientData() {
    const endPoint = `${API_URL}world/locations/measures/current`;

    try {
        const response = await fetch(endPoint, {
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
    const endPoint = `${API_URL}world/locations/${locationId}/measures/current`;

    try {
        const response = await fetch(endPoint);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch Air Gradient data:", error);
        return null;
    }
}

export async function fetchKinAQData() {
    const endPoint = `${API_URL}locations/measures/current`;

    try {
        const response = await fetch(`${endPoint}?token=${AIRGRADIENT_TOKEN}`, {
            next: { revalidate: 60 }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch Air Gradient data:", error);
        return null;
    }
}

// Get unique location
export async function fetchUniqueLocation(locationID: string) {
    const endPoint = `${API_URL}locations/${locationID}/measures/current?token=${AIRGRADIENT_TOKEN}`;

    try {
        const response = await fetch(endPoint);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch Air Gradient data:", error);
        return null;
    }
}
