export default `import React from 'react';
import { shallow } from 'enzyme';
import templatename from './templatename';

describe('<templatename />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<templatename />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
`;
