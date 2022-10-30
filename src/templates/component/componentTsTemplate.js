export default `import React, { FC } from 'react';
import styles from './TemplateName.module.css';

interface TemplateNameProps {}

const TemplateName: FC<TemplateNameProps> = () => (
  <div className={styles.TemplateName} data-testid="TemplateName">
    TemplateName Component
  </div>
);

export default TemplateName;
`;
