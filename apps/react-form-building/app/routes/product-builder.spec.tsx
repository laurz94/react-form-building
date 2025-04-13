import { render } from '@testing-library/react';

import ProductBuilder from './product-builder';

describe('ProductBuilder', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProductBuilder />);
    expect(baseElement).toBeTruthy();
  });
});
