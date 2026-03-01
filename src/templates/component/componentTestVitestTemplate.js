export default `import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import templatename from './templatename';

describe('<templatename />', () => {
  test('should mount', () => {
    render(<templatename />);

    const templateName = screen.getByTestId('templatename');

    expect(templateName).toBeInTheDocument();
  });
});
`;
