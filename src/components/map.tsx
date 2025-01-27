'use client'

import React, { useEffect, useRef } from 'react';
import maplibregl, { GeolocateControl, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MapComponent: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (mapRef.current) return; // Prevent reinitialization

        const initialLongitude = 20.0; // Longitude for the center of Central Africa
        const initialLatitude = 0.0;   // Latitude for the center of Central Africa
        const initialZoom = 3;         // Adjust zoom level as needed
        const initialBounds: [number, number, number, number] = [-10, -15, 45, 15];

        const map = new maplibregl.Map({
            container: mapContainer.current as HTMLDivElement,
            style: "https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
            center: [initialLongitude, initialLatitude],
            zoom: initialZoom,
            maxBounds: initialBounds,
        });

        map.addControl(new NavigationControl());
        map.addControl(
            new GeolocateControl({
                positionOptions: { enableHighAccuracy: true },
            })
        );

        mapRef.current = map;

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
