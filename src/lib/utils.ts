import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAirQuality(pm2_5: number): number {
  if (pm2_5 <= 12) {
    // return hap.Characteristic.AirQuality.EXCELLENT;
  } else if (pm2_5 <= 35.4) {
    // return hap.Characteristic.AirQuality.GOOD;
  } else if (pm2_5 <= 55.4) {
    // return hap.Characteristic.AirQuality.FAIR;
  } else if (pm2_5 <= 150.4) {
    // return hap.Characteristic.AirQuality.INFERIOR;
  } else {
    // return hap.Characteristic.AirQuality.POOR;
  }
  return -1;
}