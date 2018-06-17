const AvgWavelength = 580;

// Constants for dispersion calculation based on Cauchy's equation
// Source: https://en.wikipedia.org/wiki/Cauchy%27s_equation
export function getCauchyB(averageN)
{
    // Exaggerate dispersion if needed
    const CauchyC = (conf.realisticDispersion) ? 0.01 * 1000000 : 0.1 * 1000000;

    return averageN - CauchyC / Math.pow(AvgWavelength, 2);
}

// Calculate refractive index based on Cauchy's Equation
export function getDispersion(cauchyB, wavelength)
{
    // Exaggerate dispersion if needed
    const CauchyC = (conf.realisticDispersion) ? 0.01 * 1000000 : 0.1 * 1000000;

    // n(l) = B + C/(l^2)
    return cauchyB + CauchyC / Math.pow(wavelength, 2);
}
