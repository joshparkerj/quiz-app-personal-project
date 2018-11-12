import React from 'react';
import Splash from './splash';
import renderer from 'react-test-renderer';

test('Splash renders without crashing', () => {
  const component = renderer.create(
    <Splash />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
