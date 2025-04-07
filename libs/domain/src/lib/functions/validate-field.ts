import { FieldConfiguration } from '../models';
import { isObject } from './object-manipulation';

export function validateField(field: FieldConfiguration<any>, value: any) {
  const errors: string[] = [];

  if (field.isRequired && isValueEmpty(value)) {
    errors.push(`${field.label} is a required field.`);
  }

  if (
    field.controlConfig.minLength &&
    value.length < field.controlConfig.minLength
  ) {
    errors.push(
      `${field.label} must be at least ${field.controlConfig.minLength} characters.`
    );
  }

  if (
    field.controlConfig.maxLength &&
    value.length > field.controlConfig.maxLength
  ) {
    errors.push(
      `${field.label} cannot be more than ${field.controlConfig.maxLength} characters.`
    );
  }

  if (field.controlConfig.min && value < field.controlConfig.min) {
    errors.push(
      `${field.label} must be no less than ${field.controlConfig.min}.`
    );
  }

  if (field.controlConfig.max && value > field.controlConfig.max) {
    errors.push(
      `${field.label} must be no greater than ${field.controlConfig.max}.`
    );
  }

  if (field.controlConfig.minDate && value < field.controlConfig.minDate) {
    errors.push(
      `${field.label} must be no less than ${field.controlConfig.minDate}.`
    );
  }

  if (field.controlConfig.maxDate && value > field.controlConfig.maxDate) {
    errors.push(
      `${field.label} must be no greater than ${field.controlConfig.maxDate}.`
    );
  }

  if (field.controlConfig.pattern) {
    const regEx = new RegExp(field.controlConfig.pattern);

    if (!regEx.test(value)) {
      errors.push(
        `${field.label} is not formatted correctly. Please check your value and try again.`
      );
    }
  }

  return errors;
}

export function isValueEmpty(value: any): boolean {
  let valueIsEmpty = false;

  if (value === null || value === undefined || value === '') {
    valueIsEmpty = true;
  } else if (Array.isArray(value) && !value.length) {
    valueIsEmpty = true;
  } else if (isObject(value) && !Object.keys(value)?.length) {
    valueIsEmpty = true;
  }

  return valueIsEmpty;
}
