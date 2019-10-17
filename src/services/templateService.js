import { existsSync, outputFileSync } from 'fs-extra';
import chalk from 'chalk';
import { camelCase } from 'lodash-es';
import replace from 'replace';

export function generateComponentTemplates(componentTemplates) {
  for (let i = 0; i < componentTemplates.length; i++) {
    const { template, templateType, componentPath, componentName } = componentTemplates[i];

    // Make sure the component templateType does not already exist in the path directory.
    if (existsSync(componentPath)) {
      console.error(chalk.red(`${templateType} already exists in this path "${componentPath}".`));
    } else {
      try {
        outputFileSync(componentPath, template);

        const replaceDefaultOptions = {
          regex: 'TemplateName',
          replacement: componentName,
          paths: [componentPath],
          recursive: false,
          silent: true,
        };

        replace(replaceDefaultOptions);

        replace({
          ...replaceDefaultOptions,
          regex: 'templateName',
          replacement: camelCase(componentName),
        });

        console.log(chalk.green(`${templateType} was created successfully at ${componentPath}`));
      } catch (error) {
        console.error(chalk.red(`${templateType} failed and was not created.`));
        console.error(error);
      }
    }
  }
}
