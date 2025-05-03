'use client'

import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useRef, useState } from 'react'

type MapLocationProps = {
    latitude: string
    longitude: string
}

const mapStyle = {
    streets: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
    satellite: 'https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/arcgis_hybrid.json' // Hybrid alternative
}

const MapLocation = ({ latitude, longitude }: MapLocationProps) => {
    const mapContainer = useRef<HTMLDivElement | null>(null)
    const mapRef = useRef<maplibregl.Map | null>(null)
    const markerRef = useRef<maplibregl.Marker | null>(null)
    const [styleType, setStyleType] = useState<'streets' | 'satellite'>('streets')

    useEffect(() => {
        if (!latitude || !longitude) return
        if (mapRef.current) return

        mapRef.current = new maplibregl.Map({
            container: mapContainer.current!,
            style: mapStyle[styleType],
            center: [parseFloat(longitude), parseFloat(latitude)],
            zoom: 15,
            maxZoom: 15
        })

        markerRef.current = new maplibregl.Marker()
            .setLngLat([parseFloat(longitude), parseFloat(latitude)])
            .addTo(mapRef.current)

        // return () => {
        //     mapRef.current?.remove()
        // }
    }, [latitude, longitude])

    useEffect(() => {
        if (!mapRef.current) return
        mapRef.current.setStyle(mapStyle[styleType])
        mapRef.current.once('styledata', () => {
            markerRef.current?.addTo(mapRef.current!)
        })
    }, [styleType])

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
    )
}

export default MapLocation