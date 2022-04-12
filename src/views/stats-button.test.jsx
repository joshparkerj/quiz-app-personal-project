import 'core-js';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import StatsButton from './stats-button';

const statsButtonTestText = 'sorting column';
const sorting = [statsButtonTestText];

it('renders without crashing', () => {
  render(
    <StatsButton sorting={sorting} column={0} columnSort={() => {}} />,
  );

  const statsButton = screen.getByText(statsButtonTestText);
  expect(statsButton).toBeInTheDocument();
});
