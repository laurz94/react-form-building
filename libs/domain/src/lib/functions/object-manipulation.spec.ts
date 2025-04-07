import {
  createNestedObject,
  isObject
} from './object-functions';

describe('Object Functions', () => {
  describe('isObject', () => {
    it('return true when value is an object', () => {
      const value = { name: 'Jon Arbuckle', dateOfBirth: 'June 19, 1978' };
      const expectedValue = true;
      const testValue = isObject(value);

      expect(testValue).toEqual(expectedValue);
    });
    it('return true when value is a record', () => {
      const value: Record<
        'Garfield' | 'Nermal' | 'Arlene',
        {
          age: number;
          breed: string;
        }
      > = {
        Garfield: { age: 10, breed: 'Tabby' },
        Nermal: { age: 5, breed: 'Siamese' },
        Arlene: { age: 8, breed: 'Turkish Angora' },
      };
      const expectedValue = true;
      const testValue = isObject(value);

      expect(testValue).toEqual(expectedValue);
    });
    it('return false when value is an array', () => {
      const value = ['Garfield', 'Nermal', 'Arlene'];
      const expectedValue = false;
      const testValue = isObject(value);

      expect(testValue).toEqual(expectedValue);
    });
    it('return false when value is a string', () => {
      const value = 'Garfield';
      const expectedValue = false;
      const testValue = isObject(value);

      expect(testValue).toEqual(expectedValue);
    });
    it('return false when value is a number', () => {
      const value = 2500;
      const expectedValue = false;
      const testValue = isObject(value);

      expect(testValue).toEqual(expectedValue);
    });
  });
  describe('createNestedObject', () => {
    it('can walk flat objects', () => {
      const value = { name: 'Jon Arbuckle', dateOfBirth: 'June 19, 1978' };
      const expectedValue = {
        name: 'Jon Arbuckle',
        dateOfBirth: 'June 19, 1978',
      };
      const testValue = createNestedObject(value);

      expect(testValue).toEqual(expectedValue);
    });
    it('can walk nested objects', () => {
      const value = {
        name: 'Jon Arbuckle',
        dateOfBirth: 'June 19, 1978',
        'pets.cats': [
          {
            name: 'Garfield',
            age: 8,
            breed: 'Tabby',
          },
          { name: 'Nermal', age: 1, breed: 'Siamese' },
          { name: 'Arlene', age: 6, breed: 'Turkish Angora' },
        ],
        'pets.dogs': [{ name: 'Odie', age: 5, breed: 'Dachshund' }],
      };
      const expectedValue = {
        name: 'Jon Arbuckle',
        dateOfBirth: 'June 19, 1978',
        pets: {
          cats: [
            {
              name: 'Garfield',
              age: 8,
              breed: 'Tabby',
            },
            { name: 'Nermal', age: 1, breed: 'Siamese' },
            { name: 'Arlene', age: 6, breed: 'Turkish Angora' },
          ],
          dogs: [{ name: 'Odie', age: 5, breed: 'Dachshund' }],
        },
      };
      const testValue = createNestedObject(value);

      expect(testValue).toEqual(expectedValue);
    });
    it('can walk deeply nested objects', () => {
      const value = {
        name: 'Jon Arbuckle',
        dateOfBirth: 'June 19, 1978',
        'pets.cats': [
          {
            name: 'Garfield',
            age: 8,
            breed: 'Tabby',
            'favoriteFood.pasta': 'Lasagna',
          },
          { name: 'Nermal', age: 1, breed: 'Siamese' },
          { name: 'Arlene', age: 6, breed: 'Turkish Angora' },
        ],
        'pets.dogs': [
          {
            name: 'Odie',
            age: 5,
            breed: 'Dachshund',
            'favoriteFood.sandwich': 'Hamburger',
          },
        ],
      };
      const expectedValue = {
        name: 'Jon Arbuckle',
        dateOfBirth: 'June 19, 1978',
        pets: {
          cats: [
            {
              name: 'Garfield',
              age: 8,
              breed: 'Tabby',
              favoriteFood: {
                pasta: 'Lasagna',
              },
            },
            { name: 'Nermal', age: 1, breed: 'Siamese' },
            { name: 'Arlene', age: 6, breed: 'Turkish Angora' },
          ],
          dogs: [
            {
              name: 'Odie',
              age: 5,
              breed: 'Dachshund',
              favoriteFood: {
                sandwich: 'Hamburger',
              },
            },
          ],
        },
      };
      const testValue = createNestedObject(value);

      expect(testValue).toEqual(expectedValue);
    });
  });
});
