export default `import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TemplateName from './TemplateName';

describe('<TemplateName />', () => {
  afterEach(cleanup);

  test('it should mount', () => {
    const { getByText } = render(<TemplateName />);
    const FollowBtn = getByText('TemplateName Component');

    expect(FollowBtn).toBeInTheDocument();
  });
});`;
