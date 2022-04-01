import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Admin from './admin';

it('renders without crashing', () => {
  render(
    <Admin />,
  );

  const adminOptions = screen.getByText(/Admin Options/i);
  expect(adminOptions).toBeInTheDocument();
});
