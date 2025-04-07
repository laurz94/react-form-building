import { toTitleCase } from './string-manipulation';

describe('String Manipulation', () => {
  describe('toTitleCase', () => {
    it('return Title Case from camelCase', () => {
      const value = 'firstName';
      const expectedValue = 'First Name';
      const testValue = toTitleCase(value);

      expect(testValue).toEqual(expectedValue);
    });

    it('return Title Case from PascalCase', () => {
      const value = 'FirstName';
      const expectedValue = 'First Name';
      const testValue = toTitleCase(value);

      expect(testValue).toEqual(expectedValue);
    });
  });
});
