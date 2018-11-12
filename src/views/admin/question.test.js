import React from 'react';
import Question from './question';
import renderer from 'react-test-renderer';

const data = {
  text: 'a',
  answer: 'b'
}

test('Question renders without crashing', () => {
  const component = renderer.create(
    <Question data={data} />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
