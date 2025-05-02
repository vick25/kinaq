'use client';

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';

export default function MapTest({ latitude, longitude }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markerRef = useRef(null)
    const [lng] = useState(21.753);
    const [lat] = useState(-3.6844);
    const [zoom] = useState(4);
    const [styleType, setStyleType] = useState('streets');
    // const [API_KEY] = useState('YOUR_MAPTILER_API_KEY_HERE');

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`,//`https://demotiles.maplibre.org/style.json`,
            center: [longitude, latitude],
            zoom: 13
        });

        map.current.addControl(new maplibregl.ScaleControl(), 'top-right');
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');
        map.current.addControl(new maplibregl.GeolocateControl(), 'top-right');

        markerRef.current = new maplibregl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map.current)

        // return () => {
        //     map.current?.remove()
        // }
    }, [longitude, latitude]);

    return (
        <>
            <div className="absolute left-0 top-0 z-10 m-2 flex">
                <button
                    className={`rounded-l-md px-4 py-2 text-sm font-medium ${styleType === 'streets' ? 'bg-gray-300' : 'bg-white'} text-gray-700 hover:bg-gray-50`}
                    onClick={() => setStyleType('streets')}
                >
                    Map
                </button>
                <button
                    className={`rounded-r-md px-4 py-2 text-sm font-medium ${styleType === 'satellite' ? 'bg-gray-300' : 'bg-white'} text-gray-700 hover:bg-gray-50`}
                    onClick={() => setStyleType('satellite')}
                >
                    Satellite
                </button>
            </div>
            <div ref={mapContainer} className="h-full w-full" />
        </>
    );
}