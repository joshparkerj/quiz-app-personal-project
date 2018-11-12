import React from 'react';
import NewQuestion from './newquestion';
import renderer from 'react-test-renderer';

test('NewQuestion renders without crashing', () => {
  const component = renderer.create(
    <NewQuestion />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
