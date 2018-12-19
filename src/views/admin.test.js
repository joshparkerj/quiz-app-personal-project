import React from 'react';
import Admin from './admin';
import renderer from 'react-test-renderer';

function TestComponent(props){
  return (
      <Admin />
  )
}

test('Admin renders without crashing', () => {
  const component = renderer.create(
    <TestComponent />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
