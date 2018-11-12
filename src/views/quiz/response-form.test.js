import React from 'react';
import ResponseForm from './response-form';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import store from '../../redux/store';

function TestComponent(props){
  return (
    <Provider store={store}>
      <ResponseForm />
    </Provider>
  )
}

test('ResponseForm renders without crashing', () => {
  const component = renderer.create(
    <TestComponent />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
