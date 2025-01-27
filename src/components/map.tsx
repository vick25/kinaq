'use client'

import React, { useEffect, useRef } from 'react';
import maplibregl, { GeolocateControl, NavigationControl, AttributionControl, ScaleControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { time } from 'console';

interface AirGradientPointData {
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
type GradientData = AirGradientPointData[];

interface MapComponentProps {
    gradientData: GradientData; // Use the correct type
}

const MapComponent: React.FC<MapComponentProps> = ({ gradientData }) => {
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
            style: "https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
            center: [initialLongitude, initialLatitude],
            zoom: initialZoom,
            // maxBounds: initialBounds,
        });

        map.addControl(new NavigationControl(), 'top-left');
        map.addControl(
            new GeolocateControl({
                positionOptions: { enableHighAccuracy: true },
            })
        );
        ;
        map.addControl(new ScaleControl({
            maxWidth: 80,
            unit: 'metric'
        }));
        map.addControl(new AttributionControl({
            customAttribution: '<a href="https://www.airgradient.com/" target="_blank">&copy; AirGradient</a> | <a href="https://www.wasaru.org/" target="_blank">&copy; WASARU </a>',
            compact: false,
        }));

        mapRef.current = map;

        // Fetch and add points to the map
        const fetchData = async () => {
            try {
                // const response = await fetch(
                //     "https://api.airgradient.com//public/api/v1/world/locations/measures/current"
                // );
                const data = gradientData;

                const pointsGeoJSON = {
                    type: "FeatureCollection",
                    features: data.map((item: any) => ({
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [item.longitude, item.latitude],
                        },
                        properties: {
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
                            "circle-radius": 6,
                            "circle-color": "#FF5722",
                        },
                    });

                    map.on("click", "location-points", (e) => {
                        const coordinates = e.features?.[0].geometry.coordinates.slice();
                        const { locationName, pm2_5, timestamp } = e.features?.[0].properties || {};

                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                        }

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
        };
    }, []);

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />
        </div>
    );
};

export default MapComponent;
