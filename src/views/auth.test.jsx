import 'core-js';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Auth from './auth';

it('renders without crashing', () => {
  render(
    <Auth checkAuth={() => { }} loggedin={false} />,
  );

  const username = screen.getByText(/Username/i);
  expect(username).toBeInTheDocument();
});
