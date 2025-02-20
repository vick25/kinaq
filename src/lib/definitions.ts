export interface IMapComponentProps {
    gradientData: GradientData; // Use the correct type
}

export type GradientData = IAirGradientPointData[];

export interface IAirGradientPointData {
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


export interface ILocationData {
    locationName: string;
    publicLocationName: string;
    latitude: number;
    longitude: number;
    offline?: boolean;
    pm01: number;
    pm02: number;
    pm10: number;
    pm003Count: number;
    atmp: number;
    rhum: number
    rco2: number;
    tvoc: number;
    wifi: number;
    timestamp: string;
    tvocIndex: number;
    noxIndex: number;
    heatindex: number;
    publicPlaceName?: null;
    publicPlaceUrl?: null;
    publicContributorName?: null;
    timezone: string;
    model?: string;
    firmwareVersion?: string
    locationId: number;
}

export interface ICustomGradientGaugeProps {
    limits: { value: number; color: string }[];
    label?: string;
    value: number;
    valueSuffix?: string;
    tickSuffix?: string;
    min?: number;
    max?: number;
}

export const COLORS = {
    green: '#41966A',
    yellow: '#FBDD59',
    orange: '#F39C4B',
    red: '#BD2738',
    purple: '#5C1993',
    maroon: '#751426',
    grey: '#464A4F',
    white: '#FFFFFF',
    lightBlue: '#7CDDED',
    darkRed: '#960232',
    background: '#F5F5F5',
};

export interface Breakpoint {
    low: number;
    high: number;
    aqi_low: number;
    aqi_high: number;
}

export const pm25_breakpoints: Breakpoint[] = [
    { low: 0.0, high: 12.0, aqi_low: 0, aqi_high: 50 },
    { low: 12.1, high: 35.4, aqi_low: 51, aqi_high: 100 },
    { low: 35.5, high: 55.4, aqi_low: 101, aqi_high: 150 },
    { low: 55.5, high: 150.4, aqi_low: 151, aqi_high: 200 },
    { low: 150.5, high: 250.4, aqi_low: 201, aqi_high: 300 },
    { low: 250.5, high: 350.4, aqi_low: 301, aqi_high: 400 },
    { low: 350.5, high: 500.4, aqi_low: 401, aqi_high: 500 }
];

export const pm10_breakpoints: Breakpoint[] = [
    { low: 0, high: 54, aqi_low: 0, aqi_high: 50 },
    { low: 55, high: 154, aqi_low: 51, aqi_high: 100 },
    { low: 155, high: 254, aqi_low: 101, aqi_high: 150 },
    { low: 255, high: 354, aqi_low: 151, aqi_high: 200 },
    { low: 355, high: 424, aqi_low: 201, aqi_high: 300 },
    { low: 425, high: 504, aqi_low: 301, aqi_high: 400 },
    { low: 505, high: 604, aqi_low: 401, aqi_high: 500 }
];