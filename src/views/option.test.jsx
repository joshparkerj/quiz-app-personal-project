import 'core-js';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Option from './option';

const testOptionText = 'test option text';

it('renders without crashing', () => {
  render(
    <Option text={testOptionText} hc={() => {}} num={0} />,
  );

  const optionButton = screen.getByText(testOptionText);
  expect(optionButton).toBeInTheDocument();
});
