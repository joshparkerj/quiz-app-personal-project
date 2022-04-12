import 'core-js';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import ShowStats from './show-stats';

it('renders without crashing', () => {
  render(
    <ShowStats />,
  );

  const categoryTableHeader = screen.getByText(/Category/i);
  expect(categoryTableHeader).toBeInTheDocument();
});
