import { COLORS, ICustomGradientGaugeProps } from '@/lib/definitions';
import dynamic from 'next/dynamic';

const GaugeComponent = dynamic(() => import('react-gauge-component'), {
    ssr: false,
});

const LocationGauge = ({
    value,
    limits,
    label,
    valueSuffix = '',
    tickSuffix = '',
    min = 0,
    max = 100,
}: ICustomGradientGaugeProps) => {
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
                    value={value}
                    arc={{
                        width: 0.2,
                        padding: 0.005,
                        cornerRadius: 1,
                        gradient: true,
                        subArcs: limits.map((limit, index) => ({
                            limit: limit.value,
                            color: limit.color,
                            showTick: true,
                        })),
                    }}
                    pointer={{
                        color: COLORS.grey,
                        length: 0.8,
                        width: 10,
                        elastic: true,
                    }}
                    labels={{
                        valueLabel: {
                            formatTextValue: (value: any) => `${value}${valueSuffix}`,
                            style: {
                                fontSize: '32px',
                                textShadow:
                                    'black 1px 0.5px 0px, black 0px 0px 0.03em, black 0px 0px 0.01em',
                            },
                        },
                        tickLabels: {
                            type: 'outer',
                            defaultTickValueConfig: {
                                formatTextValue: (value: any) => `${value}${tickSuffix}`,
                                style: { fontSize: 10 }
                            },
                        },
                    }}
                />
            </div>
        </div>
    )
}

export default LocationGauge