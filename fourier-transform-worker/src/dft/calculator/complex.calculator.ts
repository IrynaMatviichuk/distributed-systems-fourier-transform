import { Complex } from '../type/complex.type';

export class ComplexCalculator {
  public static add(a: Complex, b: Complex): Complex {
    return [a[0] + b[0], a[1] + b[1]];
  }

  public static multiply(a: Complex, b: Complex): Complex {
    return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  }
}
