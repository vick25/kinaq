import dynamic from 'next/dynamic';
const GaugeComponent = dynamic(() => import('react-gauge-component'), {
    ssr: false,
});
import styles from './CustomGradientGauge.module.scss';
import React from 'react'

export const COLORS = {
    green: '#7BDA72',
    orange: '#F0C42D',
    red: '#EC2C45',
    grey: '#464A4F',
    white: '#FFFFFF',
    lightBlue: '#7CDDED',
    darkRed: '#960232',
    purple: '#512871',
    background: '#F5F5F5',
};

interface ICustomGradientGaugeProps {
    limits: { value: number; color: string }[];
    label?: string;
    value: number;
    valueSuffix?: string;
    tickSuffix?: string;
    min?: number;
    max?: number;
}

const LocationGauge = ({
    value,
    limits,
    label,
    valueSuffix = '',
    tickSuffix = '',
    min = 0,
    max = 100,
}: ICustomGradientGaugeProps) => {

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


    function getPM25Color(pmValue: number): string {
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

    // function calculateAirQuality(pm2_5: number): number {
    //     if (pm2_5 <= 12) {
    //         return hap.Characteristic.AirQuality.EXCELLENT;
    //     } else if (pm2_5 <= 35.4) {
    //         return hap.Characteristic.AirQuality.GOOD;
    //     } else if (pm2_5 <= 55.4) {
    //         return hap.Characteristic.AirQuality.FAIR;
    //     } else if (pm2_5 <= 150.4) {
    //         return hap.Characteristic.AirQuality.INFERIOR;
    //     } else {
    //         return hap.Characteristic.AirQuality.POOR;
    //     }
    // }
    // Good
    // Moderate
    // Unhealthy Sensitive Groups
    // Unhealthy
    // Very Unhealthy
    // Hazardous

    return (
        <div className="space-y-2">
            <div>
                <p style={{
                    color: "white",
                    fontSize: "20px",
                    margin: "auto",
                    textAlign: "center"
                }}>{label}</p>
                <GaugeComponent
                    type='semicircle'
                    minValue={min}
                    maxValue={max}
                    arc={{
                        gradient: true,
                        subArcs: limits.map((limit, index) => ({
                            limit: limit.value,
                            color: limit.color,
                        })),
                    }}
                    pointer={{
                        color: COLORS.grey,
                        length: 0.8,
                        width: 10,
                    }}
                    labels={{
                        valueLabel: {
                            formatTextValue: (value: any) => `${value}${valueSuffix}`,
                            style: {
                                fontSize: '40px',
                                textShadow:
                                    'black 1px 0.5px 0px, black 0px 0px 0.03em, black 0px 0px 0.01em',
                            },
                        },
                        tickLabels: {
                            defaultTickValueConfig: {
                                formatTextValue: (value: any) => `${value}${tickSuffix}`,
                            },
                        },
                    }}
                    value={value}
                />
            </div>
        </div>
    )
}

export default LocationGauge

