import 'core-js';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import SimilarUsers from './similar-users';

it('renders without crashing', () => {
  render(
    <SimilarUsers />,
  );

  const similarUsers = screen.getByText(/questions/i);
  expect(similarUsers).toBeInTheDocument();
});
