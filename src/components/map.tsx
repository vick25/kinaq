'use client';

import { fetchKinAQData } from '@/actions/airGradientData';
import { kinAQPoints, styles } from '@/lib/constants';
import { IAirGradientPointData } from '@/lib/definitions';
import { formatDateToLocaleString, getPM25Color } from '@/lib/utils';
import useLocationStore from '@/stores/location-store';
import maplibregl, { AttributionControl, GeolocateControl, Map, NavigationControl, ScaleControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

const useScrollZoomControl = (map: Map | null, isMobile: boolean) => {
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!map) return;

        const enableZoom = () => map.scrollZoom.enable();
        const disableZoom = () => map.scrollZoom.disable();

        if (isMobile) {
            enableZoom();
            return;
        }

        disableZoom();

        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey) {
                setMessage(null);
                enableZoom();
            } else {
                setMessage('Hold Ctrl to zoom');
                disableZoom();
                setTimeout(() => setMessage(null), 1500);
            }
        };

        map.getCanvas().addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            map.getCanvas().removeEventListener('wheel', handleWheel);
        };
    }, [map, isMobile]);

    return message;
};

const useDeviceType = (): boolean => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const update = () => setIsMobile(window.innerWidth < 768);
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return isMobile;
};

const populateMarkers = async (
    map: Map,
    popupRef: React.RefObject<maplibregl.Popup | null>,
    setLocationId: (id: number) => void,
    retrieveLocation: (id: number, coords: number[]) => void,
    locale: string
) => {
    const data: IAirGradientPointData[] = await fetchKinAQData();

    const features: GeoJSON.Feature[] = data.map(item => {
        const kinPoint = kinAQPoints.find(p => p.locationId === item.locationId)!;
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: kinPoint.coordinates
            },
            properties: {
                locationId: item.locationId,
                locationName: item.locationName,
                pm2_5: item.pm02,
                timestamp: item.timestamp,
                offline: item.offline
            }
        };
    });

    const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features
    };

    if (map.getSource('locations')) {
        const source = map.getSource('locations') as maplibregl.GeoJSONSource;
        source.setData(geojson);
    } else {
        map.addSource('locations', { type: 'geojson', data: geojson });

        map.addLayer({
            id: 'location-points',
            type: 'circle',
            source: 'locations',
            paint: {
                'circle-radius': 8,
                'circle-stroke-width': 2,
                'circle-stroke-color': [
                    "case",
                    ["==", ["get", "offline"], true], "#FFF",
                    "darkgreen"
                ],
                'circle-color': [
                    'step',
                    ['get', 'pm2_5'],
                    getPM25Color(10), 12,
                    getPM25Color(35), 35.4,
                    getPM25Color(50), 55.4,
                    getPM25Color(100), 150.4,
                    getPM25Color(180), 250.4,
                    getPM25Color(300)
                ]
            }
        });

        // map.addLayer({
        //     id: 'location-labels',
        //     type: 'symbol',
        //     source: 'locations',
        //     layout: {
        //         'text-field': ['get', 'locationName'],
        //         'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        //         'text-size': 12,
        //         'text-offset': [0, 1.5],
        //         'text-anchor': 'top'
        //     },
        //     paint: {
        //         'text-color': '#000',
        //         'text-halo-color': '#FFF',
        //         'text-halo-width': 1
        //     }
        // })

        map.on('click', 'location-points', (e) => {
            const coords = (e.features?.[0].geometry as GeoJSON.Point).coordinates;
            const { locationId } = e.features?.[0].properties || {};
            retrieveLocation(locationId, coords);
            setLocationId(locationId);
        });

        map.on('mousemove', 'location-points', (e) => {
            const coords = (e.features?.[0].geometry as GeoJSON.Point).coordinates;
            const { locationName, pm2_5, timestamp } = e.features?.[0].properties || {};

            popupRef.current?.remove();
            popupRef.current = new maplibregl.Popup({ closeButton: false })
                .setLngLat(coords as [number, number])
                .setHTML(`<strong>${locationName}</strong><br>PM2.5: ${pm2_5 ?? '-'} μg/m³<br>Last updated: ${formatDateToLocaleString(locale, timestamp)}`)
                .addTo(map);
        });

        map.on('mouseenter', 'location-points', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'location-points', () => {
            map.getCanvas().style.cursor = '';
            popupRef.current?.remove();
        });
    }
};

const MapComponent: React.FC = () => {
    const mapRef = useRef<Map | null>(null);
    const popupRef = useRef<maplibregl.Popup | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    const isMobile = useDeviceType();
    const locale = useLocale();
    const router = useRouter();

    const [currentStyleSource, setCurrentStyleSource] = useState(styles[0].source);
    const { retrieveLocation, coordinates, locationId, setIsMapUpdated } = useLocationStore();

    const message = useScrollZoomControl(mapRef.current, isMobile);

    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: currentStyleSource,
            center: [20.0, 0.0],
            zoom: 1,
            maxBounds: [14.66241, -5.501214, 17.093503, -3.307021],
            attributionControl: false
        });

        map.addControl(new NavigationControl(), 'top-right');
        map.addControl(new GeolocateControl({ positionOptions: { enableHighAccuracy: true } }));
        map.addControl(new ScaleControl({ maxWidth: 80, unit: 'metric' }));
        map.addControl(new AttributionControl({
            compact: true,
            customAttribution: '<a href="https://www.airgradient.com/" target="_blank">&copy; AirGradient</a> | <a href="https://www.wasaru.org/" target="_blank">&copy; WASARU</a>'
        }));

        mapRef.current = map;

        map.on('load', () => {
            populateMarkers(map, popupRef, () => { }, retrieveLocation, locale);
        });
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        const interval = setInterval(async () => {
            await populateMarkers(mapRef.current!, popupRef, () => { }, retrieveLocation, locale);

            if (locationId !== -1 && coordinates) {
                retrieveLocation(locationId, coordinates);
                setIsMapUpdated(true);
            }

            router.refresh();
        }, 60000);

        return () => clearInterval(interval);
    }, [locationId, coordinates]);

    useEffect(() => {
        if (!mapRef.current || !coordinates || coordinates.length === 0) return;

        const timer = setTimeout(() => {
            mapRef.current?.flyTo({
                center: coordinates as [number, number],
                zoom: 12,
                essential: true
            });
        }, 1500);

        return () => clearTimeout(timer);
    }, [coordinates]);

    const handleMapChange = (label: string) => {
        if (!mapRef.current) return;

        const selected = styles.find(style => style.label === label);
        if (selected && selected.source !== currentStyleSource) {
            setCurrentStyleSource(selected.source);

            // Store current coordinates and zoom level
            const currentCenter = mapRef.current.getCenter();
            const currentZoom = mapRef.current.getZoom();

            mapRef.current.once('styledata', () => {
                // Re-add sources and layers after new style loads
                populateMarkers(
                    mapRef.current!,
                    popupRef,
                    () => { },
                    retrieveLocation,
                    locale
                );

                // Restore map position
                mapRef.current!.setCenter(currentCenter);
                mapRef.current!.setZoom(currentZoom);
            });

            // Set new style
            mapRef.current.setStyle(selected.source);
        }
    };

    return (
        <div className='relative h-full w-full'>
            {message && (
                <div className='absolute inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 text-white z-10 pointer-events-none'>
                    {message}
                </div>
            )}
            <div className="absolute left-2 top-2 z-20 flex rounded-md shadow-xs">
                {styles.map((style, index) => (
                    <button
                        key={style.label}
                        onClick={() => handleMapChange(style.label)}
                        className={`px-4 py-2 text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50
                            ${index === 0 ? 'rounded-l-md' : ''} 
                            ${index === styles.length - 1 ? 'rounded-r-md' : '-ml-px'} 
                            ${currentStyleSource === style.source ? 'bg-gray-300 font-bold outline-2 outline-blue-500 z-10' : ''}`}
                    >
                        {style.label}
                    </button>
                ))}
            </div>
            <div ref={mapContainerRef} className="h-full w-full" />
        </div>
    );
};

export default MapComponent;