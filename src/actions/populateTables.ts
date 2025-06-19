'use server';

import { IUser } from '@/lib/definitions';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { fetchAllAirGradientData } from './airGradientData';

// Filter locations with "KINAQ" in their name
interface IAirGradientAPILocation {
    locationId: string;
    locationName: string;
    latitude: number;
    longitude: number;
    serial?: string;
    offline?: boolean;
}

// export async function populateLocationsTable() {
//     try {
//         // Fetch data from AirGradient
//         const airGradientData: IAirGradientLocation[] = await fetchAllAirGradientData();

//         const kinaqLocations: IAirGradientLocation[] = airGradientData.filter(location =>
//             location?.locationName?.includes('KINAQ')
//         );
//         // console.log(kinaqLocations)

//         // Create locations in database
//         const createdLocations = await Promise.all(
//             kinaqLocations.map(async (location) => {
//                 const locationData = {
//                     locationName: location.locationName,
//                     latitude: location.latitude.toString(),
//                     longitude: location.longitude.toString(),
//                     serial: location.serial || null,
//                     offline: location.offline ?? true
//                 };

//                 return await prisma.location.upsert({
//                     where: {
//                         locationID: location.locationId.toString()
//                     },
//                     update: {
//                         ...locationData,
//                         // Only update if offline value is different
//                         ...(typeof location.offline !== 'undefined'
//                             ? {
//                                 offline: {
//                                     set: location.offline
//                                 }
//                             }
//                             : {})
//                     },
//                     create: {
//                         locationID: location.locationId.toString(),
//                         ...locationData
//                     }
//                 });
//             })
//         );

//         if (createdLocations.length === 0) {
//             await prisma.location.updateMany({
//                 data: {
//                     offline: true
//                 }
//             });
//         }

//         console.log(`Successfully populated ${createdLocations.length} KINAQ locations`);
//         return createdLocations;
//     } catch (error) {
//         console.error('Error populating locations:', (error as Error).message);
//         throw error;
//     }
// }

export async function populateLocationsTable(): Promise<{
    processedOnlineCount: number;
    markedOfflineCount: number;
}> {
    try {
        console.log('Starting to populate locations table...');
        const airGradientApiData: IAirGradientAPILocation[] = await fetchAllAirGradientData();

        const onlineKinaqSensorsFromAPI = airGradientApiData.filter(location =>
            location.locationName?.toUpperCase().includes('KINAQ')
        );
        console.log(`Found ${onlineKinaqSensorsFromAPI.length} KINAQ sensors from API.`);

        const onlineKinaqSensorApiIds = onlineKinaqSensorsFromAPI.map(s => s.locationId.toString());

        let processedOnlineCount = 0;

        // Step 1: Upsert sensors that are currently online (present in the API feed)
        // and ensure their 'offline' status is false.
        if (onlineKinaqSensorsFromAPI.length > 0) {
            const upsertPromises = onlineKinaqSensorsFromAPI.map(async (apiSensor) => {
                const locationDataForDb = {
                    locationName: apiSensor.locationName || `KINAQ Sensor ${apiSensor.locationId}`,
                    latitude: apiSensor.latitude.toString(),
                    longitude: apiSensor.longitude.toString(),
                    serial: apiSensor.serial || null,
                    offline: false, // Explicitly false as it's in the API feed
                    updatedAt: new Date(), // Good practice to update this
                };

                try {
                    await prisma.location.upsert({
                        where: {
                            locationID: apiSensor.locationId.toString(),
                        },
                        update: locationDataForDb,
                        create: {
                            locationID: apiSensor.locationId.toString(),
                            ...locationDataForDb,
                            // createdAt will be set by default by Prisma if configured
                        },
                    });
                    processedOnlineCount++;
                } catch (upsertError) {
                    console.error(`Error upserting locationID ${apiSensor.locationId}:`, (upsertError as Error).message);
                    // Decide if one error should stop the whole process or just be logged
                }
            });
            await Promise.all(upsertPromises);
            console.log(`Successfully upserted/updated ${processedOnlineCount} KINAQ locations as online.`);
        } else {
            console.log('No KINAQ sensors reported as online by the API.');
        }

        // Step 2: Mark KINAQ sensors in DB as 'offline' if they are NOT in the current API feed.
        // This handles sensors that were previously online but are now offline.
        const updateOfflineResult = await prisma.location.updateMany({
            where: {
                // Filter for KINAQ locations in your DB.
                // Adjust this if 'locationName' isn't the sole indicator for KINAQ.
                // For example, if you have a 'type' column or a naming convention for locationID.
                locationName: {
                    contains: 'KINAQ', // Or 'startsWith', or a more specific pattern
                    mode: 'insensitive', // If KINAQ casing might vary
                },
                locationID: {
                    notIn: onlineKinaqSensorApiIds, // Only update those NOT in the current online list
                },
                offline: false, // Only update those currently marked as online
            },
            data: {
                offline: true,
                // updatedAt: new Date(),
            },
        });

        const markedOfflineCount = updateOfflineResult.count;
        console.log(`Marked ${markedOfflineCount} KINAQ locations as offline.`);

        return { processedOnlineCount, markedOfflineCount };
    } catch (error) {
        console.error('Error in populateLocationsTable:', (error as Error).message);
        // Depending on your error handling strategy, you might re-throw,
        // or return a specific error object.
        throw error; // Re-throw to indicate failure to the caller
    }
}

export async function getLocations() {
    try {
        const locations = await prisma.location.findMany({
            select: {
                id: true,
                locationName: true,
                locationID: true,
                latitude: true,
                longitude: true,
            },
            orderBy: {
                locationName: 'asc'
            }
        })
        return locations
    } catch (error) {
        console.error('Error fetching locations:', (error as Error).message)
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
        console.error('Error fetching requests:', (error as Error).message);
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
        console.error('Error updating request:', (error as Error).message);
        throw error;
    }
}