export class FfUtilCalculator {
  public static exponent(k: number, N: number) {
    const mapExponent = {};
    const x = -2 * Math.PI * (k / N);

    mapExponent[N] = mapExponent[N] || {};
    mapExponent[N][k] = mapExponent[N][k] || [Math.cos(x), Math.sin(x)];

    return mapExponent[N][k];
  }
}
