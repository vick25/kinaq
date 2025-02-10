'use client'

import React, { useEffect, useRef, useState } from 'react';
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
    const timeoutRef = useRef<NodeJS.Timeout>(null)
    const { retrieveLocation } = useLocationStore();

    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);

    const handleWheel = (e: MouseEvent) => {
        if (!e.ctrlKey || !e.metaKey) {
            setMessage('Scroll with Ctrl/Cmd to zoom.')
            if (e.target.className === 'maplibregl-canvas') {
                e.preventDefault();
                e.stopPropagation();
                if (timeoutRef.current) clearTimeout(timeoutRef.current)
                timeoutRef.current = setTimeout(() => {
                    setMessage('')
                }, 2000)
            }
        } else {
            setMessage('')
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
                timeoutRef.current = null
            }
        }
    }

    mapContainer.current?.addEventListener('wheel', handleWheel)

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

                        new maplibregl.Popup()
                            .setLngLat(coordinates as [number, number])
                            .setHTML(
                                `<strong>${locationName}</strong><br />PM2.5: ${pm2_5}<br>
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
            mapRef.current = null;
            if (mapContainer.current) {
                mapContainer.current.removeEventListener('wheel', handleWheel)
            }
        };
    }, []);

    return (
        <div className='relative h-full w-full' style={{ position: 'relative', height: '100%', width: '100%' }}>
            {message && (
                <div className='absolute top-0 w-full h-full flex justify-center items-center bg-white opacity-70 text-gray-400 z-[2]'
                // style={{
                //     position: 'absolute',
                //     top: '0',
                //     // left: '0',
                //     width: '100%',
                //     height: '100%',
                //     aspectRatio: '1/1',
                //     display: 'flex',
                //     justifyContent: 'center',
                //     alignItems: 'center',
                //     background: 'white',
                //     fontWeight: '700',
                //     opacity: '0.7',
                //     color: 'gray',
                //     zIndex: 2
                // }}
                >
                    {message}
                </div>
            )}
            <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />
        </div>
    );
};

export default MapComponent;
