import React from 'react';
import Questions from './questions';
import renderer from 'react-test-renderer';

test('Questions renders without crashing', () => {
  const component = renderer.create(
    <Questions />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
