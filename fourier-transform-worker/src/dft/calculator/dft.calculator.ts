import { Complex } from '../type/complex.type';
import { ComplexCalculator } from './complex.calculator';
import { FfUtilCalculator } from './ff-util.calculator';

export class DftCalculator {
  public partiallyCalculateLoop(
    initialK: number,
    finalK: number,
    N: number,
    vector: number[],
  ): Record<number, Complex> {
    const partialResult = {};
    for (let k = initialK; k <= finalK; k++) {
      partialResult[k] = this.calculateXK(k, N, vector);
    }

    return partialResult;
  }

  public calculateXK(k: number, N: number, vector: number[]): Complex {
    let XK: [number, number] = [0, 0];

    for (let i = 0; i < N; i++) {
      const exp = FfUtilCalculator.exponent(k * i, N);
      const term = ComplexCalculator.multiply([vector[i], 0], exp);
      XK = ComplexCalculator.add(XK, term);
    }

    return XK;
  }
}
