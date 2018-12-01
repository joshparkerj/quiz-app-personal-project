import React from 'react';
import App from './app';
import renderer from 'react-test-renderer';

function TestComponent(props) {
  return (
    <App />
  )
}

test('App renders without crashing', () => {
  const component = renderer.create(
    <TestComponent />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
