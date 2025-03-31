import { COLORS, ICustomGradientGaugeProps } from '@/lib/definitions';
import dynamic from 'next/dynamic';

const GaugeComponent = dynamic(() => import('react-gauge-component'), {
    ssr: false,
});

const LocationGauge: React.FC<ICustomGradientGaugeProps> = ({
    value,
    limits,
    label,
    valueSuffix = '',
    tickSuffix = '',
    min = 0,
    max = 500
}) => {
    return (
        <div className="space-y-2">
            <>
                <p className='text-black text-sm m-auto text-center'>{label}</p>
                <GaugeComponent
                    type='semicircle'
                    minValue={min}
                    maxValue={max}
                    value={value}
                    arc={{
                        width: 0.2,
                        padding: 0.005,
                        cornerRadius: 2,
                        //gradient: true,
                        subArcs: limits.map((limit) => ({
                            limit: limit.value,
                            color: limit.color,
                            showTick: true,
                            // tooltip: {
                            //     text: {label}
                            // },
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
                            formatTextValue: (value: number) => `${value}${valueSuffix}`,
                            style: {
                                fontSize: '32px',
                                textShadow:
                                    'black 1px 0.5px 0px, black 0px 0px 0.03em, black 0px 0px 0.01em',
                            },
                        },
                        tickLabels: {
                            type: 'outer',
                            defaultTickValueConfig: {
                                formatTextValue: (value: number) => `${value}${tickSuffix}`,
                                style: { fontSize: 10 }
                            },
                            ticks: [
                                { value: 250 },
                                { value: 350 },
                                { value: 400 },
                                { value: 450 }
                            ],
                        },
                    }}
                />
            </>
        </div>
    )
}

export default LocationGauge