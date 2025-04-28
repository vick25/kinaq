'use server';

import { IUser } from '@/lib/definitions';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { fetchAllAirGradientData } from './airGradientData';

// Filter locations with "KINAQ" in their name
interface IAirGradientLocation {
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
        const airGradientData: IAirGradientLocation[] = await fetchAllAirGradientData();

        const kinaqLocations: IAirGradientLocation[] = airGradientData.filter(location =>
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
                        serial: location.serial || null,
                        offline: location.offline || false
                    },
                    create: {
                        locationID: location.locationId.toString(),
                        locationName: location.locationName,
                        latitude: location.latitude.toString(),
                        longitude: location.longitude.toString(),
                        serial: location.serial || null,
                        offline: location.offline || false
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

export async function getRequestData(user: IUser) {
    try {
        const requests = await prisma.request.findMany({
            where: {
                userId: user?.id,
                deleted: false,
            },
            include: {
                location: {
                    select: {
                        locationName: true,
                        locationID: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });
        return requests;
    } catch (error) {
        console.error('Error fetching requests:', error);
        return [];
    }
}

export async function updateRequest(id: string) {
    try {
        const updatedRequest = await prisma.request.update({
            where: {
                id: parseInt(id),
            },
            data: {
                deleted: true,
            },
        });
        revalidatePath('/requests');
        return updatedRequest;
    } catch (error) {
        console.error('Error updating request:', error);
        throw error;
    }
}