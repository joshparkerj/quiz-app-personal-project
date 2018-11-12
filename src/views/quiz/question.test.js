import React from 'react';
import Question from './question';
import renderer from 'react-test-renderer';

test('Question renders without crashing', () => {
  const component = renderer.create(
    <Question />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
