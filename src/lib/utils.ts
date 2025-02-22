import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AQI, Breakpoint, ILocationData, pm10_breakpoints, pm25_breakpoints } from "./definitions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTo2Places = (amount: number) => {
  return amount && amount?.toFixed(2);
};

export function formatDateToLocaleString(date: string): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  });
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
      ret = '#41966A';
      break;
    }
    case 'yellow': {
      ret = '#FBDD59';
      break;
    }
    case 'orange': {
      ret = '#F39C4B';
      break;
    }
    case 'red': {
      ret = '#BD2738';
      break;
    }
    case 'purple': {
      ret = '#5C1993';
      break;
    }
    case 'maroon': {
      ret = '#751426';
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
    ret = 'maroon'
  }
  return getBGColor(ret)
}

/**
 * Calculate the AQI for a given concentration based on breakpoints.
 */
function calculateAqi(concentration: number, breakpoints: Breakpoint[]): number | null {
  for (let bp of breakpoints) {
    if (concentration >= bp.low && concentration <= bp.high) {
      return Math.round((bp.aqi_high - bp.aqi_low) / (bp.high - bp.low) * (concentration - bp.low) + bp.aqi_low);
    }
  }
  return null;
}

/**
 * Calculate the AQI for PM2.5 and PM10 and return the overall AQI.
 */
export function calculateOverallAqi(data: ILocationData): AQI {
  const pm25 = data.pm02;
  const pm10 = data.pm10;
  const aqi_pm25 = pm25 !== undefined ? calculateAqi(pm25, pm25_breakpoints) : null;
  const aqi_pm10 = pm10 !== undefined ? calculateAqi(pm10, pm10_breakpoints) : null;
  const values: number[] = [];
  if (aqi_pm25 !== null) values.push(aqi_pm25);
  if (aqi_pm10 !== null) values.push(aqi_pm10);
  const overall_aqi = values.length > 0 ? Math.max(...values) : null;
  return { AQI_PM25: aqi_pm25, AQI_PM10: aqi_pm10, Overall_AQI: overall_aqi };
}

export function getAqiDescription(aqi: number): { category: string; color: string } {
  if (aqi <= 50) {
    return { category: "Good", color: "Green" };
  } else if (aqi <= 100) {
    return { category: "Moderate", color: "Yellow" };
  } else if (aqi <= 150) {
    return { category: "Unhealthy for Sensitive Groups", color: "Orange" };
  } else if (aqi <= 200) {
    return { category: "Unhealthy", color: "Red" };
  } else if (aqi <= 300) {
    return { category: "Very Unhealthy", color: "Purple" };
  } else {
    return { category: "Hazardous", color: "Maroon" };
  }
}
