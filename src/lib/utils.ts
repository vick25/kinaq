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

function getBGColor(color: string): string {
  let ret: string;
  switch (color) {
    case 'green': {
      ret = '#1de208';
      break;
    }
    case 'yellow': {
      ret = '#e2e020';
      break;
    }
    case 'orange': {
      ret = '#e26a05';
      break;
    }
    case 'red': {
      ret = '#e20410';
      break;
    }
    case 'purple': {
      ret = '#7f01e2';
      break;
    }
    case 'brown': {
      ret = '#903305';
      break;
    }
    case 'blue': {
      ret = '#166de2';
      break;
    }
    case 'lightslategray': {
      ret = '#778899';
      break;
    }
    default: {
      ret = '#166de2';
      break;
    }
  }
  return ret
}

export function getPM25Color(pmValue: number): string {
  let ret = '#7f01e2';
  if (pmValue <= 12) {
    ret = 'green'
  }
  if (pmValue > 12 && pmValue <= 35.4) {
    ret = 'yellow'
  }
  if (pmValue > 35.4 && pmValue <= 55.4) {
    ret = 'orange'
  }
  if (pmValue > 55.4 && pmValue <= 150.4) {
    ret = 'red'
  }
  if (pmValue > 150.4 && pmValue <= 250.4) {
    ret = 'purple'
  }
  if (pmValue > 250.4 && pmValue <= 1000) {
    ret = 'brown'
  }
  return getBGColor(ret)
}
