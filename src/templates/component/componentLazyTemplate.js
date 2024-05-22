export default `import React, { lazy, Suspense } from 'react';

const Lazytemplatename = lazy(() => import('./templatename'));

const templatename = props => (
  <Suspense fallback={null}>
    <Lazytemplatename {...props} />
  </Suspense>
);

export default templatename;
`;
