export default `import { lazy, Suspense, ComponentProps } from 'react';

const Lazytemplatename = lazy(() => import('./templatename'));

const templatename = (props: ComponentProps<typeof Lazytemplatename>) => (
  <Suspense fallback={null}>
    <Lazytemplatename {...props} />
  </Suspense>
);

export default templatename;
`;
