import { existsSync, outputFileSync } from 'fs-extra';
import chalk from 'chalk';
import replace from 'replace';
import { camelCase } from 'lodash-es';
import componentJsTemplate from '../../templates/component/componentJsTemplate';
import componentTsTemplate from '../../templates/component/componentTsTemplate';
import componentCssTemplate from '../../templates/component/componentCssTemplate';
import componentLazyTemplate from '../../templates/component/componentLazyTemplate';
import componentTsLazyTemplate from '../../templates/component/componentTsLazyTemplate';
import componentStoryTemplate from '../../templates/component/componentStoryTemplate';
import componentTestEnzymeTemplate from '../../templates/component/componentTestEnzymeTemplate';
import componentTestDefaultTemplate from '../../templates/component/componentTestDefaultTemplate';
import componentTestTestingLibraryTemplate from '../../templates/component/componentTestTestingLibraryTemplate';

// private

function getComponentScriptTemplate({ cmd, componentConfig, componentName, componentPathDir, usesTypeScript }) {
  const fileExtension = usesTypeScript ? 'tsx' : 'js';
  let template = usesTypeScript ? componentTsTemplate : componentJsTemplate;

  // --- If test library is not Testing Library or if withTest is false. Remove data-testid from template

  if (componentConfig.test.library !== 'Testing Library' || !cmd.withTest) {
    template = template.replace(` data-testid="TemplateName"`, '');
  }

  // --- If it has a corresponding stylesheet

  if (cmd.withStyle) {
    const module = componentConfig.css.module ? '.module' : '';
    const cssPath = `${componentName}${module}.${componentConfig.css.preprocessor}`;

    // --- If the css module is true make sure to update the template accordingly

    if (module.length) {
      template = template.replace(`'./TemplateName.module.css'`, `'./${cssPath}'`);
    } else {
      template = template.replace(`{styles.TemplateName}`, `"${componentName}"`);
      template = template.replace(`styles from './TemplateName.module.css'`, `'./${cssPath}'`);
    }
  } else {
    // --- If no stylesheet, remove className attribute and style import from jsTemplate

    template = template.replace(`className={styles.TemplateName} `, '');
    template = template.replace(`import styles from './TemplateName.module.css';`, '');
  }

  return {
    template,
    templateType: `Component "${componentName}.${fileExtension}"`,
    componentPath: `${componentPathDir}/${componentName}.${fileExtension}`,
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

function getComponentTestTemplate({ componentConfig, componentName, componentPathDir, usesTypeScript }) {
  const fileExtension = usesTypeScript ? 'tsx' : 'js';
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
    templateType: `Test "${componentName}.test.${fileExtension}"`,
    componentPath: `${componentPathDir}/${componentName}.test.${fileExtension}`,
    componentName,
  };
}

function getComponentStoryTemplate({ componentName, componentPathDir, usesTypeScript }) {
  const fileExtension = usesTypeScript ? 'tsx' : 'js';

  return {
    template: componentStoryTemplate,
    templateType: `Story "${componentName}.stories.${fileExtension}"`,
    componentPath: `${componentPathDir}/${componentName}.stories.${fileExtension}`,
    componentName,
  };
}

function getComponentLazyTemplate({ componentName, componentPathDir, usesTypeScript }) {
  const fileExtension = usesTypeScript ? 'tsx' : 'js';

  return {
    template: usesTypeScript ? componentTsLazyTemplate : componentLazyTemplate,
    templateType: `Lazy "${componentName}.lazy.${fileExtension}"`,
    componentPath: `${componentPathDir}/${componentName}.lazy.${fileExtension}`,
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

export function getComponentTemplate(cmd, componentConfig, componentName, templateType, usesTypeScript) {
  const componentPathDir = `${cmd.path}/${componentName}`;
  const templateMap = {
    [componentTemplateTypes.STYLE]: getComponentStyleTemplate,
    [componentTemplateTypes.TEST]: getComponentTestTemplate,
    [componentTemplateTypes.STORY]: getComponentStoryTemplate,
    [componentTemplateTypes.LAZY]: getComponentLazyTemplate,
    [componentTemplateTypes.COMPONENT]: getComponentScriptTemplate,
  };

  if (templateMap[templateType]) {
    return templateMap[templateType]({ cmd, componentConfig, componentName, componentPathDir, usesTypeScript });
  }

  return null;
}
