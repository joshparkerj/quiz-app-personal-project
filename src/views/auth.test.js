import React from 'react';
import Auth from './auth';
import renderer from 'react-test-renderer';

function TestComponent(props) {
  return (
    <Auth />
  )
}

test('Auth renders without crashing', () => {
  const component = renderer.create(
    <TestComponent />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
