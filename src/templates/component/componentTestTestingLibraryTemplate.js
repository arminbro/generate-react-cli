export default `import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TemplateName from './TemplateName';

describe('<TemplateName />', () => {
  test('it should mount', () => {
    render(<TemplateName />);
    
    const templateName = screen.getByTestId('TemplateName');

    expect(templateName).toBeInTheDocument();
  });
});`;
