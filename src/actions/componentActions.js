import chalk from 'chalk';
import { generateComponentTemplates } from '../services/templateService';
import componentJsTemplate from '../templates/components/componentJsTemplate';
import componentLazyTemplate from '../templates/components/componentLazyTemplate';
import componentCssTemplate from '../templates/components/componentCssTemplate';
import componentTestDefaultTemplate from '../templates/components/componentTestDefaultTemplate';
import componentTestEnzymeTemplate from '../templates/components/componentTestEnzymeTemplate';
import componentTestTestingLibraryTemplate from '../templates/components/componentTestTestingLibraryTemplate';
import componentStoryTemplate from '../templates/components/componentStoryTemplate';

export function generateComponent(componentName, cmd, componentConfig) {
  const componentPathDir = `${cmd.path}/${componentName}`;
  const module = componentConfig.css.module ? '.module' : '';
  const componentTemplates = [
    {
      template: componentJsTemplate.replace(
        'TemplateName.module.css',
        `${componentName}${module}.${componentConfig.css.preprocessor}`
      ),
      templateType: `Component "${componentName}.js"`,
      componentPath: `${componentPathDir}/${componentName}.js`,
      componentName,
    },
    {
      template: componentCssTemplate,
      templateType: `Stylesheet "${componentName}${module}.${componentConfig.css.preprocessor}"`,
      componentPath: `${componentPathDir}/${componentName}${module}.${componentConfig.css.preprocessor}`,
      componentName,
    },
  ];

  // Make sure component name is valid.
  if (!componentName.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
    console.error(
      chalk.red.bold(
        'ERROR: Component name is invalid. Please use a valid naming convention for the component you are trying to create.'
      )
    );

    return;
  }

  // converting boolean to string intentionally.
  if (cmd.withTest.toString() === 'true') {
    componentTemplates.push({
      template: getTestingLibraryTemplate(componentConfig),
      templateType: `Test "${componentName}.test.js"`,
      componentPath: `${componentPathDir}/${componentName}.test.js`,
      componentName,
    });
  }

  // converting boolean to string intentionally.
  if (cmd.withStory.toString() === 'true') {
    componentTemplates.push({
      template: componentStoryTemplate,
      templateType: `Story "${componentName}.stories.js"`,
      componentPath: `${componentPathDir}/${componentName}.stories.js`,
      componentName,
    });
  }

  // converting boolean to string intentionally.
  if (cmd.withLazy.toString() === 'true') {
    componentTemplates.push({
      template: componentLazyTemplate,
      templateType: `Lazy "${componentName}.lazy.js"`,
      componentPath: `${componentPathDir}/${componentName}.lazy.js`,
      componentName,
    });
  }

  generateComponentTemplates(componentTemplates);
}

function getTestingLibraryTemplate(componentConfig) {
  switch (componentConfig.test.library) {
    case 'Enzyme':
      return componentTestEnzymeTemplate;
    case 'Testing Library':
      return componentTestTestingLibraryTemplate;
    default:
      return componentTestDefaultTemplate;
  }
}
