import chalk from 'chalk';
import { generateComponentTemplates, getTestingLibraryTemplate } from '../services/templateService';
import componentJsTemplate from '../templates/components/componentJsTemplate';
import componentLazyTemplate from '../templates/components/componentLazyTemplate';
import componentCssTemplate from '../templates/components/componentCssTemplate';
import componentStoryTemplate from '../templates/components/componentStoryTemplate';

export function generateComponent(componentName, cmd, componentConfig) {
  const componentPathDir = `${cmd.path}/${componentName}`;
  const module = componentConfig.css.module ? '.module' : '';
  let jsTemplate = componentJsTemplate;

  // Make sure component name is valid.
  if (!componentName.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
    console.error(
      chalk.red.bold(
        'ERROR: Component name is invalid. Please use a valid naming convention for the component you are trying to create.'
      )
    );

    return;
  }

  // if test library is not Testing Library. Remove data-testid from jsTemplate
  if (componentConfig.test.library !== 'Testing Library') {
    jsTemplate = jsTemplate.replace(` data-testid="TemplateName"`, '');
  }

  // if the css module is true make sure to update the componentJsTemplate accordingly
  if (module.length) {
    jsTemplate = jsTemplate.replace(
      `'./TemplateName.module.css'`,
      `'./${componentName}${module}.${componentConfig.css.preprocessor}'`
    );
  } else {
    jsTemplate = jsTemplate.replace(`{styles.TemplateName}`, `"${componentName}"`);
    jsTemplate = jsTemplate.replace(
      `styles from './TemplateName.module.css'`,
      `'./${componentName}${module}.${componentConfig.css.preprocessor}'`
    );
  }

  const componentTemplates = [
    {
      template: jsTemplate,
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

  // converting boolean to string intentionally.
  if (cmd.withTest.toString() === 'true') {
    componentTemplates.push({
      template: getTestingLibraryTemplate(componentName, componentConfig),
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
