export const API_URL = 'https://api.airgradient.com/public/api/v1/'

export const kinAQPoints: { locationName: string, locationId: number, coordinates: [number, number] }[] = [
    { locationName: "KINAQ BelAir", locationId: 155791, coordinates: [15.275384, -4.435699] },
    { locationName: "KINAQ Cité Verte", locationId: 155431, coordinates: [15.25749, -4.44431] },
    { locationName: "KINAQ Gare Centrale", locationId: 155432, coordinates: [15.31421, -4.30353] },
    { locationName: "KINAQ Huilleries", locationId: 155445, coordinates: [15.30345461202056, -4.3116352271371] },
    { locationName: "KINAQ Kalembelembe", locationId: 155647, coordinates: [15.303139505375293, -4.32453608278304] },
    { locationName: "KINAQ Kimwenza", locationId: 153688, coordinates: [15.273191482850512, -4.469586791919752] },
    { locationName: "KINAQ Masiala", locationId: 154304, coordinates: [15.248748794122553, -4.370019400071179] },
    { locationName: "KINAQ UPN", locationId: 154639, coordinates: [15.25848, -4.39785] },
    { locationName: "KINAQ Limete", locationId: 155951, coordinates: [15.3437, -4.36597] }
]

export const kinAQfeatureCollection = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {
                locationName: "KINAQ BelAir",
                locationId: 155791,
                serial: "airgradient:d83bda1bc60c"
            },
            geometry: {
                type: "Point",
                coordinates: [15.275384, -4.435699]
            }
        },
        {
            type: "Feature",
            properties: {
                locationName: "KINAQ Cité Verte",
                locationId: 155431,
                serial: "airgradient:d83bda1c779c"
            },
            geometry: {
                type: "Point",
                coordinates: [15.25749, -4.44431]
            }
        },
        {
            type: "Feature",
            properties: {
                locationName: "KINAQ Gare Centrale",
                locationId: 155432,
                serial: "airgradient:d83bda1b900c"
            },
            geometry: {
                type: "Point",
                coordinates: [15.31421, -4.30353]
            }
        },
        {
            type: "Feature",
            properties: {
                locationName: "KINAQ Huilleries",
                locationId: 155445,
                serial: "airgradient:d83bda1b9aa4"
            },
            geometry: {
                type: "Point",
                coordinates: [15.30345461202056, -4.3116352271371]
            }
        },
        {
            type: "Feature",
            properties: {
                locationName: "KINAQ Kalembelembe",
                locationId: 155647,
                serial: "airgradient:d83bda1b500c"
            },
            geometry: {
                type: "Point",
                coordinates: [15.303139505375293, -4.32453608278304]
            }
        },
        {
            type: "Feature",
            properties: {
                locationName: "KINAQ Kimwenza",
                locationId: 153688,
                serial: "airgradient:d83bda1befa8"
            },
            geometry: {
                type: "Point",
                coordinates: [15.273191482850512, -4.469586791919752]
            }
        },
        {
            type: "Feature",
            properties: {
                locationName: "KINAQ Masiala",
                locationId: 154304,
                serial: "airgradient:d83bda1c171c"
            },
            geometry: {
                type: "Point",
                coordinates: [15.248748794122553, -4.370019400071179]
            }
        },
        {
            type: "Feature",
            properties: {
                locationName: "KINAQ UPN",
                locationId: 154639,
                serial: "airgradient:d83bda1c0f64"
            },
            geometry: {
                type: "Point",
                coordinates: [15.25848, -4.39785]
            }
        },
        {
            type: "Feature",
            properties: {
                locationName: "KINAQ Limete",
                locationId: 155951,
                serial: "airgradient:d83bda1fb01c"
            },
            geometry: {
                type: "Point",
                coordinates: [15.3437, -4.36597]
            }
        }
    ]
};
