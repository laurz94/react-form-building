/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { createRoutesStub } from 'react-router';
import App from '../../app/app';

test('renders loader data', async () => {
  const ReactRouterStub = createRoutesStub([
    {
      path: '/',
      Component: App,
    },
  ]);

  render(<ReactRouterStub />);

  await waitFor(() => screen.findByText('Hello there,'));
});
