export default `import React, { Fragment, lazy, Suspense } from 'react';

const LazyTemplateName = lazy(() => import('./TemplateName'));

const TemplateName = props => (
  <Suspense fallback={<Fragment />}>
    <LazyTemplateName {...props} />
  </Suspense>
);

export default TemplateName;
`;