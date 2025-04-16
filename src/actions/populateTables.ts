'use server'

import prisma from '@/lib/prisma';
import { fetchAllAirGradientData } from './airGradientData';

// Filter locations with "KINAQ" in their name
interface AirGradientLocation {
    locationId: string;
    locationName: string;
    latitude: number;
    longitude: number;
    serial?: string;
    offline?: boolean;
}
export async function populateLocationsTable() {
    try {
        // Fetch data from AirGradient
        const airGradientData: AirGradientLocation[] = await fetchAllAirGradientData();

        const kinaqLocations: AirGradientLocation[] = airGradientData.filter(location =>
            location?.locationName?.includes('KINAQ')
        );
        // console.log(kinaqLocations)

        // Create locations in database
        const createdLocations = await Promise.all(
            kinaqLocations.map(async (location) => {
                return await prisma.location.upsert({
                    where: {
                        locationID: location.locationId.toString()
                    },
                    update: {
                        locationName: location.locationName,
                        latitude: location.latitude.toString(),
                        longitude: location.longitude.toString(),
                        serial: location.serial || null
                    },
                    create: {
                        locationID: location.locationId.toString(),
                        locationName: location.locationName,
                        latitude: location.latitude.toString(),
                        longitude: location.longitude.toString(),
                        serial: location.serial || null
                    }
                });
            })
        );

        console.log(`Successfully populated ${createdLocations.length} KINAQ locations`);
        return createdLocations;
    } catch (error) {
        console.error('Error populating locations:', error);
        throw error;
    }
}

export async function getLocations() {
    try {
        const locations = await prisma.location.findMany({
            select: {
                id: true,
                locationName: true,
                locationID: true
            },
            orderBy: {
                locationName: 'asc'
            }
        })
        return locations
    } catch (error) {
        console.error('Error fetching locations:', error)
        return []
    }
}