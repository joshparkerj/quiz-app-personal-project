import React from 'react';
import App from './app';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';

function TestComponent(props){
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

test('App renders without crashing', () => {
  const component = renderer.create(
    <TestComponent />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
