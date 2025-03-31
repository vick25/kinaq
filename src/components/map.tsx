'use client'

import React, { useEffect, useState } from 'react';
import maplibregl, { Map, GeolocateControl, NavigationControl, AttributionControl, ScaleControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import useLocationStore from '../stores/location-store';
import { IMapComponentProps } from '@/lib/definitions';
import { formatDateToLocaleString, getPM25Color } from '@/lib/utils';
import { kinAQPoints } from '@/lib/constants';

const MapComponent: React.FC<IMapComponentProps> = ({ gradientData }) => {
    const [map, setMap] = useState<Map | null>(null);
    const [message, setMessage] = useState<string | null>('')
    const [locationId, setLocationId] = useState<number | null>(-1)
    const { retrieveLocation, coordinates } = useLocationStore();
    let popup: maplibregl.Popup | null = null; // Store the popup instance

    //Fetch and add points to the map
    const populateMarkers = async () => {
        try {
            const pointsGeoJSON: string | GeoJSON.FeatureCollection = {
                type: "FeatureCollection",
                features: gradientData?.map((item) => {
                    const kinAQFeature = kinAQPoints.find(feat => feat.locationId == item.locationId);
                    // console.log(kinAQFeature)
                    return {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [kinAQFeature?.coordinates[0] as number, kinAQFeature?.coordinates[1] as number],
                        },
                        properties: {
                            locationId: item.locationId,
                            locationName: item.locationName,
                            pm2_5: item.pm02,
                            timestamp: item.timestamp,
                        },
                    }
                }),
            };

            if (map) {
                map.on("load", () => {
                    map.addSource("locations", {
                        type: "geojson",
                        data: pointsGeoJSON,
                    });

                    map.addLayer({
                        id: "location-points",
                        type: "circle",
                        source: "locations",
                        paint: {
                            "circle-radius": 8,
                            "circle-stroke-width": 2,
                            "circle-stroke-color": [
                                "case",
                                ["==", ["get", "offline"], true], "#FFF",
                                "darkgreen"
                            ],
                            // "circle-stroke-color": "#FFF",
                            // "circle-color": "#FF5722",
                            'circle-color': ['step',
                                ['get', 'pm2_5'],
                                getPM25Color(10),
                                12,
                                getPM25Color(35),
                                35.4,
                                getPM25Color(50),
                                55.4,
                                getPM25Color(100),
                                150.4,
                                getPM25Color(180),
                                250.4,
                                getPM25Color(300)
                            ]
                        },
                    });

                    map.on("click", "location-points", async (e) => {
                        const coordinates = (e.features?.[0].geometry as GeoJSON.Point).coordinates.slice();
                        const { locationId } = e.features?.[0].properties || {};

                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                        }

                        // new maplibregl.Popup()
                        //     .setLngLat(coordinates as [number, number])
                        //     .setHTML(
                        //         `<strong>${locationName}</strong><br>
                        //     PM2.5: ${pm2_5}<br>
                        //     Time: ${new Date(timestamp).toLocaleString()}`
                        //     )
                        //     .addTo(map);

                        retrieveLocation(locationId, coordinates); // Store the locationId
                        setLocationId(locationId);
                    });

                    map.on("mousemove", "location-points", async (e) => {
                        const coordinates = (e.features?.[0].geometry as GeoJSON.Point).coordinates.slice();
                        const { locationName, pm2_5, timestamp } = e.features?.[0].properties || {};

                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                        }

                        // Close the previous popup if it exists
                        if (popup) {
                            popup.remove();
                            popup = null; // Reset the popup variable
                        }

                        popup = new maplibregl.Popup({ closeButton: false })
                            .setLngLat(coordinates as [number, number])
                            .setHTML(
                                `<strong>${locationName}</strong><br>
                                    PM2.5: ${pm2_5 ?? "-"} μg/m³<br>
                                    Last updated: ${formatDateToLocaleString(timestamp)}`)
                            .addTo(map);
                    });

                    map.on("mouseenter", "location-points", () => {
                        map.getCanvas().style.cursor = "pointer";
                    });

                    map.on("mouseleave", "location-points", () => {
                        map.getCanvas().style.cursor = "";
                        if (popup) {
                            popup.remove();
                            popup = null;
                        }
                    });
                });
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    // To Load the Map
    useEffect(function createMap() {
        if (map) return;

        const initialLongitude = 20.0; // Longitude for the center of Central Africa
        const initialLatitude = 0.0;   // Latitude for the center of Central Africa
        const initialZoom = 1;         // Adjust zoom level as needed
        const initialBounds: [number, number, number, number] = [14.66241, -5.501214, 17.093503, -3.307021];
        // This is used to initialize the map. The library used here is Maplibre GL JS (https://maplibre.org).
        setMap(
            new maplibregl.Map({
                container: 'map',
                style:
                    // 'https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json',
                    // "https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
                    'https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json',
                center: [initialLongitude, initialLatitude],
                zoom: initialZoom,
                maxBounds: initialBounds,
                attributionControl: false
            })
                .addControl(new NavigationControl(), 'top-left')
                .addControl(new GeolocateControl({
                    positionOptions: { enableHighAccuracy: true },
                }))
                .addControl(new ScaleControl({
                    maxWidth: 80,
                    unit: 'metric'
                }))
                .addControl(new AttributionControl({
                    customAttribution: '<a href="https://www.airgradient.com/" target="_blank">&copy; AirGradient</a> | <a href="https://www.wasaru.org/" target="_blank">&copy; WASARU </a>',
                    compact: true,
                }))
        );

        () => {
            setMap(null)
        }
    }, [map]);

    useEffect(() => {
        if (!map) return; // Prevent reinitialization

        map.on('wheel', (e) => {
            if (!e.originalEvent.ctrlKey) {
                map.scrollZoom.disable();
                setMessage('Hold Ctrl to zoom');
                // Remove the overlay after a short delay
                setTimeout(() => {
                    setMessage('');
                }, 2000);
            } else {
                setMessage('');
                map.scrollZoom.enable();
            }
        });

        populateMarkers();

        return () => {
            setMap(null)
        }
    }, [map]);

    // useEffect(() => {
    //     populateMarkers();
    //     const interval = setInterval(populateMarkers, 300000); // 5 minutes
    //     return () => clearInterval(interval);
    // }, []);

    // Use the user last location as the default air quality information when the application loads
    useEffect(() => {
        if (!map) return;
        // Fly to a random location by offsetting the point -74.50, 40
        // by up to 5 degrees.
        if (locationId)
            setTimeout(() => {
                map.flyTo({
                    center: [
                        coordinates[0], // -74.5 + (Math.random() - 0.5) * 10,
                        coordinates[1] // 40 + (Math.random() - 0.5) * 10
                    ],
                    zoom: 12,
                    essential: true // this animation is considered essential with respect to prefers-reduced-motion
                })
            }, 2000);
    }, [map, locationId, coordinates])

    return (
        <div className='relative h-full w-full'>
            {message && (
                <div className='absolute top-0 w-full h-full flex justify-center items-center bg-white opacity-70 text-gray-600 z-[2]'>
                    {message}
                </div>
            )}
            <div id='map' className='h-full w-full' />
        </div>
    );
};

export default MapComponent;
