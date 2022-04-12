import 'core-js';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import JoinCreate from './join-create';

it('renders without crashing', () => {
  render(
    <JoinCreate username="josh" />,
  );

  const findAGame = screen.getByText(/Find A Game To Join/i);
  expect(findAGame).toBeInTheDocument();
});
