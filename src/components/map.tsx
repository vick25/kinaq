'use client'

import React, { use, useEffect, useRef, useState } from 'react';
import maplibregl, { GeolocateControl, NavigationControl, AttributionControl, ScaleControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import useLocationStore from '../../stores/location-store';
import { getPM25Color } from './location-gauge'

interface IAirGradientPointData {
    locationId: number;
    locationName: string;
    publicLocationName: string;
    latitude: number;
    longitude: number;
    pm01: number;
    pm02: number;
    pm10: number;
    pm003Count: number;
    atmp: number;
    rhum: number;
    rco2: number;
    tvoc: number;
    wifi: number;
    timestamp: string;
    ledMode: string;
    ledCo2Threshold1: number;
    ledCo2Threshold2: number;
    ledCo2ThresholdEnd: number;
    serialno: string | number;
    model: string | number;
    firmwareVersion: string | null;
    tvocIndex: number;
    noxIndex: number;
    offline: boolean;
    heatindex: number;
    publicPlaceName: null;
    publicPlaceUrl: null;
    publicContributorName: null;
    timezone: string;
}
type GradientData = IAirGradientPointData[];

interface IMapComponentProps {
    gradientData: GradientData; // Use the correct type
}

const MapComponent: React.FC<IMapComponentProps> = ({ gradientData }) => {
    const [message, setMessage] = useState('')
    const [locationId, setLocationId] = useState<number | null>(-1)
    const { retrieveLocation } = useLocationStore();

    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (mapRef.current) return; // Prevent reinitialization

        const initialLongitude = 20.0; // Longitude for the center of Central Africa
        const initialLatitude = 0.0;   // Latitude for the center of Central Africa
        const initialZoom = 2;         // Adjust zoom level as needed
        const initialBounds: [number, number, number, number] = [-10, -15, 45, 15];

        const map = new maplibregl.Map({
            container: mapContainer.current as HTMLDivElement,
            style:
                // 'https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json',
                "https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
            center: [initialLongitude, initialLatitude],
            zoom: initialZoom,
            // maxBounds: initialBounds,
            attributionControl: false
        });

        map.addControl(new NavigationControl(), 'top-left');
        map.addControl(new GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
        }));
        map.addControl(new ScaleControl({
            maxWidth: 80,
            unit: 'metric'
        }));
        map.addControl(new AttributionControl({
            customAttribution: '<a href="https://www.airgradient.com/" target="_blank">&copy; AirGradient</a> | <a href="https://www.wasaru.org/" target="_blank">&copy; WASARU </a>',
            compact: true,
        }));

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

        mapRef.current = map;

        // Fetch and add points to the map
        const fetchData = async () => {
            try {
                const pointsGeoJSON: any = {
                    type: "FeatureCollection",
                    features: gradientData?.map((item: any) => ({
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [item.longitude, item.latitude],
                        },
                        properties: {
                            locationId: item.locationId,
                            locationName: item.locationName,
                            pm2_5: item.pm02,
                            timestamp: item.timestamp,
                        },
                    })),
                };

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

                    map.on("click", "location-points", (e) => {
                        const coordinates = e.features?.[0].geometry.coordinates.slice();
                        const { locationId, locationName, pm2_5, timestamp } = e.features?.[0].properties || {};

                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                        }

                        retrieveLocation(locationId); // Store the locationId
                        setLocationId(locationId);

                        new maplibregl.Popup()
                            .setLngLat(coordinates as [number, number])
                            .setHTML(
                                `<strong>${locationName}</strong><br>
                                PM2.5: ${pm2_5}<br>
                                Time: ${new Date(timestamp).toLocaleString()}`
                            )
                            .addTo(map);
                    });

                    map.on("mouseenter", "location-points", () => {
                        map.getCanvas().style.cursor = "pointer";
                    });

                    map.on("mouseleave", "location-points", () => {
                        map.getCanvas().style.cursor = "";
                    });
                });
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();

        return () => {
            map.remove();
        };
    }, []);

    useEffect(() => {
        // Fly to a random location by offsetting the point -74.50, 40
        // by up to 5 degrees.
        locationId &&
            setTimeout(() => {
                mapRef.current?.flyTo({
                    center: [
                        -74.5 + (Math.random() - 0.5) * 10,
                        40 + (Math.random() - 0.5) * 10
                    ],
                    essential: true // this animation is considered essential with respect to prefers-reduced-motion
                })
            }, 5000);
    }, [locationId])

    return (
        <div className='relative h-full w-full' style={{ position: 'relative', height: '100%', width: '100%' }}>
            {message && (
                <div className='absolute top-0 w-full h-full flex justify-center items-center bg-white opacity-70 text-gray-600 z-[2]'>
                    {message}
                </div>
            )}
            <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />
        </div>
    );
};

export default MapComponent;
