export default `import { createRoot } from 'react-dom/client';
import templatename from './templatename';

it('should mount', () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(<templatename />);
  root.unmount();
});`;
