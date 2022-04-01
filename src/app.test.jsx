import 'core-js';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import App from './app';

it('renders without crashing', () => {
  render(
    <App />,
  );

  const playGame = screen.getByText(/josh quizzes/i);
  expect(playGame).toBeInTheDocument();
});
