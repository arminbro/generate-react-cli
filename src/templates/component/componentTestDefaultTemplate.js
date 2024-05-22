export default `import React from 'react';
import ReactDOM from 'react-dom';
import templatename from './templatename';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<templatename />, div);
  ReactDOM.unmountComponentAtNode(div);
});`;
