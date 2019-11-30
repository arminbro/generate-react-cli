import chalk from 'chalk';
import { generateComponentTemplates, getTestingLibraryTemplate } from '../services/templateService';
import componentJsTemplate from '../templates/components/componentJsTemplate';
import componentLazyTemplate from '../templates/components/componentLazyTemplate';
import componentCssTemplate from '../templates/components/componentCssTemplate';
import componentStoryTemplate from '../templates/components/componentStoryTemplate';

export function generateComponent(componentName, cmd, componentConfig) {
  const componentTemplates = [];
  const componentPathDir = `${cmd.path}/${componentName}`;
  let jsTemplate = componentJsTemplate;

  // --- Make sure component name is valid.

  if (!componentName.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
    console.error(
      chalk.red.bold(
        'ERROR: Component name is invalid. Please use a valid naming convention for the component you are trying to create.'
      )
    );

    return;
  }

  // --- If test library is not Testing Library. Remove data-testid from jsTemplate

  if (componentConfig.test.library !== 'Testing Library') {
    jsTemplate = jsTemplate.replace(` data-testid="TemplateName"`, '');
  }

  if (cmd.withStyle) {
    const module = componentConfig.css.module ? '.module' : '';
    const cssPath = `${componentName}${module}.${componentConfig.css.preprocessor}`;

    // --- If the css module is true make sure to update the jsTemplate accordingly

    if (module.length) {
      jsTemplate = jsTemplate.replace(`'./TemplateName.module.css'`, `'./${cssPath}'`);
    } else {
      jsTemplate = jsTemplate.replace(`{styles.TemplateName}`, `"${componentName}"`);
      jsTemplate = jsTemplate.replace(`styles from './TemplateName.module.css'`, `'./${cssPath}'`);
    }

    componentTemplates.push({
      template: componentCssTemplate,
      templateType: `Stylesheet "${cssPath}"`,
      componentPath: `${componentPathDir}/${cssPath}`,
      componentName,
    });
  } else {
    // --- If no stylesheet remove className attribute and style import from jsTemplate

    jsTemplate = jsTemplate.replace(`className={styles.TemplateName} `, '');
    jsTemplate = jsTemplate.replace(`import styles from './TemplateName.module.css';`, '');
  }

  if (cmd.withTest) {
    componentTemplates.push({
      template: getTestingLibraryTemplate(componentName, componentConfig),
      templateType: `Test "${componentName}.test.js"`,
      componentPath: `${componentPathDir}/${componentName}.test.js`,
      componentName,
    });
  }

  if (cmd.withStory) {
    componentTemplates.push({
      template: componentStoryTemplate,
      templateType: `Story "${componentName}.stories.js"`,
      componentPath: `${componentPathDir}/${componentName}.stories.js`,
      componentName,
    });
  }

  if (cmd.withLazy) {
    componentTemplates.push({
      template: componentLazyTemplate,
      templateType: `Lazy "${componentName}.lazy.js"`,
      componentPath: `${componentPathDir}/${componentName}.lazy.js`,
      componentName,
    });
  }

  componentTemplates.push({
    template: jsTemplate,
    templateType: `Component "${componentName}.js"`,
    componentPath: `${componentPathDir}/${componentName}.js`,
    componentName,
  });

  generateComponentTemplates(componentTemplates);
}
