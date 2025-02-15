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
    green: '#1de208',
    yellow: '#e2e020',
    orange: '#e26a05',
    red: '#e20410',
    purple: '#7f01e2',
    brown: '#903305',
    grey: '#464A4F',
    white: '#FFFFFF',
    lightBlue: '#7CDDED',
    darkRed: '#960232',
    background: '#F5F5F5',
};