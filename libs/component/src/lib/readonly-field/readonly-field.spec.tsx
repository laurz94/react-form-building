/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';

import ReadonlyField from './readonly-field';

describe('ReadonlyField', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReadonlyField label='Test Field' value='Test Value' />);
    expect(baseElement).toBeTruthy();
  });
});
