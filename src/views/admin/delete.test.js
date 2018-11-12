import React from 'react';
import Delete from './delete';
import renderer from 'react-test-renderer';

const data = {
  text: 'a',
  answer: 'b'
}

test('Delete renders without crashing', () => {
  const component = renderer.create(
    <Delete data={data} />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
