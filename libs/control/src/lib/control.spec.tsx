import { render } from '@testing-library/react';

import Control from './control';

describe('Control', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Control />);
    expect(baseElement).toBeTruthy();
  });
});
