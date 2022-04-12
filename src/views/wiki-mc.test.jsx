import 'core-js';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import WikiMC from './wiki-mc';

const testText = 'wiki mc test text';

it('renders without crashing', () => {
  render(
    <WikiMC wikiText={testText} wikiAnswers={[]} imgUrl="https://via.placeholder.com/50" hc={() => {}} />,
  );

  const paragraph = screen.getByText(testText);
  expect(paragraph).toBeInTheDocument();
});
