import React from 'react';
import Admin from './admin';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import store from '../../redux/store';

function TestComponent(props){
  return (
    <Provider store={store}>
      <Admin />
    </Provider>
  )
}

test('Admin renders without crashing', () => {
  const component = renderer.create(
    <TestComponent />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
