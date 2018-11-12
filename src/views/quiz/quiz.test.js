import React from 'react';
import Quiz from './quiz';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import store from '../../redux/store';

function TestComponent(props){
  return (
    <Provider store={store}>
      <Quiz />
    </Provider>
  )
}

test('Quiz renders without crashing', () => {
  const component = renderer.create(
    <TestComponent />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
