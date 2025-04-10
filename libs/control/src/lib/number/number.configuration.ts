export interface NumberConfiguration {
  decimalPlaces: number;
  isCurrency: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  prefix?: string;
  step?: number;
}

export function getDefaultNumberConfiguration(overrides: Partial<NumberConfiguration>): NumberConfiguration {
  return Object.assign({ decimalPlaces: 0, isCurrency: false, min: 0, max: undefined, step: 1 }, overrides);
}
