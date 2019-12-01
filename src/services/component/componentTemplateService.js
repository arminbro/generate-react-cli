import { existsSync, outputFileSync } from 'fs-extra';
import chalk from 'chalk';
import replace from 'replace';
import { camelCase } from 'lodash-es';
import componentJsTemplate from '../../templates/component/componentJsTemplate';
import componentCssTemplate from '../../templates/component/componentCssTemplate';
import componentLazyTemplate from '../../templates/component/componentLazyTemplate';
import componentStoryTemplate from '../../templates/component/componentStoryTemplate';
import componentTestEnzymeTemplate from '../../templates/component/componentTestEnzymeTemplate';
import componentTestDefaultTemplate from '../../templates/component/componentTestDefaultTemplate';
import componentTestTestingLibraryTemplate from '../../templates/component/componentTestTestingLibraryTemplate';

// private

function getComponentScriptTemplate({ cmd, componentConfig, componentName, componentPathDir }) {
  let jsTemplate = componentJsTemplate;

  // --- If test library is not Testing Library or if withTest is false. Remove data-testid from jsTemplate

  if (componentConfig.test.library !== 'Testing Library' || !cmd.withTest) {
    jsTemplate = jsTemplate.replace(` data-testid="TemplateName"`, '');
  }

  // --- If it has a corresponding stylesheet

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
  } else {
    // --- If no stylesheet, remove className attribute and style import from jsTemplate

    jsTemplate = jsTemplate.replace(`className={styles.TemplateName} `, '');
    jsTemplate = jsTemplate.replace(`import styles from './TemplateName.module.css';`, '');
  }

  return {
    template: jsTemplate,
    templateType: `Component "${componentName}.js"`,
    componentPath: `${componentPathDir}/${componentName}.js`,
    componentName,
  };
}

function getComponentStyleTemplate({ componentConfig, componentName, componentPathDir }) {
  const module = componentConfig.css.module ? '.module' : '';
  const cssPath = `${componentName}${module}.${componentConfig.css.preprocessor}`;

  return {
    template: componentCssTemplate,
    templateType: `Stylesheet "${cssPath}"`,
    componentPath: `${componentPathDir}/${cssPath}`,
    componentName,
  };
}

function getComponentTestTemplate({ componentConfig, componentName, componentPathDir }) {
  let template = null;

  // --- Get test template based on test library type

  if (componentConfig.test.library === 'Enzyme') {
    template = componentTestEnzymeTemplate;
  } else if (componentConfig.test.library === 'Testing Library') {
    template = componentTestTestingLibraryTemplate.replace(/#|templateName/g, camelCase(componentName));
  } else {
    template = componentTestDefaultTemplate;
  }

  return {
    template,
    templateType: `Test "${componentName}.test.js"`,
    componentPath: `${componentPathDir}/${componentName}.test.js`,
    componentName,
  };
}

function getComponentStoryTemplate({ componentName, componentPathDir }) {
  return {
    template: componentStoryTemplate,
    templateType: `Story "${componentName}.stories.js"`,
    componentPath: `${componentPathDir}/${componentName}.stories.js`,
    componentName,
  };
}

function getComponentLazyTemplate({ componentName, componentPathDir }) {
  return {
    template: componentLazyTemplate,
    templateType: `Lazy "${componentName}.lazy.js"`,
    componentPath: `${componentPathDir}/${componentName}.lazy.js`,
    componentName,
  };
}

// public

// --- Template Types

export const componentTemplateTypes = {
  STYLE: 'withStyle',
  TEST: 'withTest',
  STORY: 'withStory',
  LAZY: 'withLazy',
  COMPONENT: 'component',
};

export function generateComponentTemplates(componentTemplates) {
  for (let i = 0; i < componentTemplates.length; i += 1) {
    const { template, templateType, componentPath, componentName } = componentTemplates[i];

    // --- Make sure the component templateType does not already exist in the path directory.

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

export function getComponentTemplate(cmd, componentConfig, componentName, templateType) {
  const componentPathDir = `${cmd.path}/${componentName}`;
  const templateMap = {
    [componentTemplateTypes.STYLE]: getComponentStyleTemplate,
    [componentTemplateTypes.TEST]: getComponentTestTemplate,
    [componentTemplateTypes.STORY]: getComponentStoryTemplate,
    [componentTemplateTypes.LAZY]: getComponentLazyTemplate,
    [componentTemplateTypes.COMPONENT]: getComponentScriptTemplate,
  };

  if (templateMap[templateType]) {
    return templateMap[templateType]({ cmd, componentConfig, componentName, componentPathDir });
  }

  return null;
}
