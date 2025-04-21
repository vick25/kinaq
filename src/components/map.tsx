'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import maplibregl, { Map, GeolocateControl, NavigationControl, AttributionControl, ScaleControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import useLocationStore from '../stores/location-store';
import { IMapComponentProps } from '@/lib/definitions';
import { formatDateToLocaleString, getPM25Color } from '@/lib/utils';
import { kinAQPoints, styles } from '@/lib/constants';

const MapComponent: React.FC<IMapComponentProps> = ({ gradientData }) => {
    const [map, setMap] = useState<Map | null>(null);
    const [message, setMessage] = useState<string | null>('')
    const [locationId, setLocationId] = useState<number | null>(-1)
    const { retrieveLocation, coordinates } = useLocationStore();
    const [currentStyleSource, setCurrentStyleSource] = useState<string>(styles[0].source);
    const popupRef = useRef<maplibregl.Popup | null>(null);
    const router = useRouter();

    // --- Handle Map Style Change ---
    const handleMapChange = useCallback((mapType: string) => {
        if (!map) return;

        const selectedStyle = styles.find(style => style.label === mapType);
        if (!selectedStyle || selectedStyle.source === currentStyleSource) {
            console.log("Style change skipped: No style found or already active.");
            return; // Don't reload if style is the same
        }

        console.log(`Changing style to: ${selectedStyle.label}`);
        setCurrentStyleSource(selectedStyle.source); // Update state for next potential init

        const currentCenter = map.getCenter();
        const currentZoom = map.getZoom();

        // Set the new style (this triggers the loading process)
        // map.setStyle(selectedStyle.source);

    }, [currentStyleSource, gradientData]);

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
                        popupRef.current?.remove();

                        popupRef.current = new maplibregl.Popup({ closeButton: false })
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
                        popupRef.current?.remove();
                        popupRef.current = null;
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
                .addControl(new NavigationControl(), 'top-right')
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
                const timer = setTimeout(() => setMessage(''), 1500);
                return () => clearTimeout(timer);
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
        router.refresh();
    }, [map, locationId, coordinates])

    return (
        <div className='relative h-full w-full'>
            {message && (
                <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 text-white text-lg font-semibold z-10 pointer-events-none'>
                    {message}
                </div>
            )}
            <div className="absolute left-2 top-2 z-20 flex rounded-md shadow-sm">
                {styles.map((style, index) => (
                    <button
                        key={style.label}
                        onClick={() => handleMapChange(style.label)}
                        className={`
                             px-4 py-2 text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                             ${index === 0 ? 'rounded-l-md' : ''}
                             ${index === styles.length - 1 ? 'rounded-r-md' : '-ml-px'}
                             ${currentStyleSource === style.source ? 'bg-gray-200 font-bold' : ''} // Indicate active style
                         `}
                    >
                        {style.label}
                    </button>
                ))}
            </div>
            <div id='map' className='h-full w-full' />
        </div>
    );
};

export default MapComponent;
