import { render } from '@testing-library/react';

import ReadonlyField from './readonly-field';

describe('ReadonlyField', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReadonlyField />);
    expect(baseElement).toBeTruthy();
  });
});
