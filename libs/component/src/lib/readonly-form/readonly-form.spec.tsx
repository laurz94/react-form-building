import { render } from '@testing-library/react';

import ReadonlyForm from './readonly-form';

describe('ReadonlyForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReadonlyForm />);
    expect(baseElement).toBeTruthy();
  });
});
