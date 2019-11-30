import { existsSync, outputFileSync } from 'fs-extra';
import chalk from 'chalk';
import replace from 'replace';
import { camelCase } from 'lodash-es';
import componentTestEnzymeTemplate from '../templates/components/componentTestEnzymeTemplate';
import componentTestDefaultTemplate from '../templates/components/componentTestDefaultTemplate';
import componentTestTestingLibraryTemplate from '../templates/components/componentTestTestingLibraryTemplate';


export function generateComponentTemplate(templateType) {

}

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

        console.log(chalk.green(`${templateType} was created successfully at ${componentPath}`));
      } catch (error) {
        console.error(chalk.red(`${templateType} failed and was not created.`));
        console.error(error);
      }
    }
  }
}

export function getTestingLibraryTemplate(componentName, componentConfig) {
  switch (componentConfig.test.library) {
    case 'Enzyme':
      return componentTestEnzymeTemplate;
    case 'Testing Library':
      return componentTestTestingLibraryTemplate.replace(/#|templateName/g, camelCase(componentName));
    default:
      return componentTestDefaultTemplate;
  }
}
