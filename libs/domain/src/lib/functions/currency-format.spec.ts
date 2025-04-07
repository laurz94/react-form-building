import { currencyFormatWithDecimals, currencyFormatWithoutDecimals } from './currency-format';

describe('Currency Format', () => {
  const value = 1000;

  describe('currencyFormatWithDecimals', () => {
    it('return value with 2 decimal points', () => {
      const expectedValue = '$1,000.00';
      const testValue = currencyFormatWithDecimals(value);

      expect(testValue).toEqual(expectedValue);
    });
  });
  describe('currencyFormatWithoutDecimals', () => {
    it('return value with no decimal points', () => {
        const expectedValue = '$1,000';
        const testValue = currencyFormatWithoutDecimals(value);
  
        expect(testValue).toEqual(expectedValue);});
  });
});
