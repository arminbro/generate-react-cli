export default `import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import templatename from './templatename';

describe('<templatename />', () => {
  test('it should mount', () => {
    render(<templatename />);

    const templateName = screen.getByTestId('templatename');

    expect(templateName).toBeInTheDocument();
  });
});`;
