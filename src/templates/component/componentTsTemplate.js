export default `import React, { FC } from 'react';
import styles from './templatename.module.css';

interface templatenameProps {}

const templatename: FC<templatenameProps> = () => (
  <div className={styles.templatename} data-testid="templatename">
    templatename Component
  </div>
);

export default templatename;
`;
