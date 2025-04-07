import { ValidationError, Validator } from '../models';
import { customValidator } from './custom-validator';

describe('Custom Validator', () => {
  const error: ValidationError = {
    name: 'test-validator',
    message: 'This test error message should be present',
  };

  function testErrorIsReturned(validator: Validator, value: any) {
    expect(customValidator(validator, value)).toBe(error);
  }

  function testNoErrorIsReturned(validator: Validator, value: any) {
    expect(customValidator(validator, value)).toBe(undefined);
  }

  describe('equal matcher', () => {
    it('return an error when the value matches', () => {
      const validator: Validator = {
        error,
        matcher: 'equals',
        valueToMatch: true,
      };
      const value = true;
      testErrorIsReturned(validator, value);
    });
    it('return undefined when the value does not match', () => {
      const validator: Validator = {
        error,
        matcher: 'equals',
        valueToMatch: true,
      };
      const value = false;
      testNoErrorIsReturned(validator, value);
    });
  });

  describe('greaterThan matcher', () => {
    it('return an error when the value matches', () => {
      const validator: Validator = {
        error,
        matcher: 'greaterThan',
        valueToMatch: 5,
      };
      const value = 6;
      testErrorIsReturned(validator, value);
    });
    it('return undefined when the value does not match', () => {
      const validator: Validator = {
        error,
        matcher: 'greaterThan',
        valueToMatch: 5,
      };
      const value = 4;
      testNoErrorIsReturned(validator, value);
    });
  });

  describe('lessThan matcher', () => {
    it('return an error when the value matches', () => {
      const validator: Validator = {
        error,
        matcher: 'lessThan',
        valueToMatch: 3,
      };
      const value = 2;
      testErrorIsReturned(validator, value);
    });
    it('return undefined when the value does not match', () => {
      const validator: Validator = {
        error,
        matcher: 'lessThan',
        valueToMatch: 3,
      };
      const value = 4;
      testNoErrorIsReturned(validator, value);
    });
  });

  describe('between matcher', () => {
    it('return an error when the value matches', () => {
      const validator: Validator = {
        error,
        matcher: 'between',
        valueToMatch: ['1985-10-27', '2015-11-01'],
      };
      const value = '2009-08-01';
      testErrorIsReturned(validator, value);
    });
    it('return undefined when the value does not match', () => {
      const validator: Validator = {
        error,
        matcher: 'between',
        valueToMatch: ['1985-10-27', '2015-11-01'],
      };
      const value = '2025-08-01';
      testNoErrorIsReturned(validator, value);
    });
  });

  describe('includes matcher', () => {
    describe('with a string value and string valueToMatch', () => {
      it('return an error when the value matches', () => {
        const validator: Validator = {
          error,
          matcher: 'includes',
          valueToMatch: 'man',
        };
        const value = 'human';
        testErrorIsReturned(validator, value);
      });
      it('return undefined when the value does not match', () => {
        const validator: Validator = {
          error,
          matcher: 'includes',
          valueToMatch: 'man',
        };
        const value = 'child';
        testNoErrorIsReturned(validator, value);
      });
    });

    describe('with an array of string values and a string valueToMatch', () => {
      it('return an error when the value matches', () => {
        const validator: Validator = {
          error,
          matcher: 'includes',
          valueToMatch: 'man',
        };
        const value = ['human', 'man', 'woman', 'child'];
        testErrorIsReturned(validator, value);
      });
      it('return undefined when the value does not match', () => {
        const validator: Validator = {
          error,
          matcher: 'includes',
          valueToMatch: 'man',
        };
        const value = ['human', 'woman', 'child'];
        testNoErrorIsReturned(validator, value);
      });
    });

    describe('with an array of string value && an array of valueToMatch', () => {
      it('return an error when the value matches', () => {
        const validator: Validator = {
          error,
          matcher: 'includes',
          valueToMatch: ['man', 'woman'],
        };
        const value = ['human', 'man', 'woman', 'child'];
        testErrorIsReturned(validator, value);
      });
      it('return undefined when the value does not match', () => {
        const validator: Validator = {
          error,
          matcher: 'includes',
          valueToMatch: ['man', 'woman'],
        };
        const value = ['human', 'child'];
        testNoErrorIsReturned(validator, value);
      });
    });
  });

  describe('Improperly configured validator', () => {
    it('return undefined for a between matcher if the valueToMatch is not an array', () => {
      const validator: Validator = {
        error,
        matcher: 'between',
        valueToMatch: '1985-10-27',
      };
      const value = '2005-04-07';
      testNoErrorIsReturned(validator, value);
    });
    it('return undefined for an includes matcher if the value is not a string or an array of strings', () => {
      const validator: Validator = {
        error,
        matcher: 'includes',
        valueToMatch: 9,
      };
      const value = 9.8;
      testNoErrorIsReturned(validator, value);
    });
    it('return undefined for an includes matcher if the valueToMatch is not a string or an array of strings', () => {
      const validator: Validator = {
        error,
        matcher: 'includes',
        valueToMatch: 9,
      };
      const value = '9.8';
      testNoErrorIsReturned(validator, value);
    });
  });
});
