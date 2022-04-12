import 'core-js';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Leaderboard from './leaderboard';

it('renders without crashing', () => {
  render(
    <Leaderboard />,
  );

  const progressLeaders = screen.getByText(/Progress Leaders/i);
  expect(progressLeaders).toBeInTheDocument();
});
