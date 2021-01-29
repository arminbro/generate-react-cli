const chalk = require('chalk');
const path = require('path');
const replace = require('replace');
const { camelCase } = require('lodash');
const { existsSync, outputFileSync, readFileSync } = require('fs-extra');

const componentJsTemplate = require('../templates/component/componentJsTemplate');
const componentTsTemplate = require('../templates/component/componentTsTemplate');
const componentCssTemplate = require('../templates/component/componentCssTemplate');
const componentLazyTemplate = require('../templates/component/componentLazyTemplate');
const componentTsLazyTemplate = require('../templates/component/componentTsLazyTemplate');
const componentStoryTemplate = require('../templates/component/componentStoryTemplate');
const componentTestEnzymeTemplate = require('../templates/component/componentTestEnzymeTemplate');
const componentTestDefaultTemplate = require('../templates/component/componentTestDefaultTemplate');
const componentTestTestingLibraryTemplate = require('../templates/component/componentTestTestingLibraryTemplate');
const reducerTsTemplate = require('../templates/component/reducerTsTemplate');
const actionTsTemplate = require('../templates/component/actionTsTemplate');

// private

function loadCustomTemplate(templatePath) {
  // --- Try loading custom template

  try {
    const template = readFileSync(templatePath, 'utf8');
    const templateFileExtension = path.extname(templatePath).split('.')[1];

    return { template, templateFileExtension };
  } catch (e) {
    console.error(
      chalk.red(
        `
ERROR: The custom template path of "${templatePath}" does not exist. 
Please make sure you're pointing to the right custom template path in your generate-react-cli.json config file.
        `
      )
    );

    return process.exit(1);
  }
}

function getComponentScriptTemplate({ cmd, cliConfigFile, componentName, componentPathDir }) {
  const { cssPreprocessor, testLibrary, usesCssModule, usesTypeScript } = cliConfigFile;
  const { customTemplates } = cliConfigFile.component[cmd.type];
  let fileExtension = usesTypeScript ? 'tsx' : 'js';
  let template = null;

  // Check for a custom component template.

  if (customTemplates && customTemplates.component) {
    // --- Load and use the custom component template

    const { template: loadedTemplate, templateFileExtension } = loadCustomTemplate(customTemplates.component);

    template = loadedTemplate;
    fileExtension = templateFileExtension;
  } else {
    // --- Else use GRC built-in component template

    template = usesTypeScript ? componentTsTemplate : componentJsTemplate;

    // --- If test library is not Testing Library or if withTest is false. Remove data-testid from template

    if (testLibrary !== 'Testing Library' || !cmd.withTest) {
      template = template.replace(` data-testid="TemplateName"`, '');
    }

    // --- If it has a corresponding stylesheet

    if (cmd.withStyle) {
      const module = usesCssModule ? '.module' : '';
      const cssPath = `${componentName}${module}.${cssPreprocessor}`;

      // --- If the css module is true make sure to update the template accordingly

      if (module.length) {
        template = template.replace(`'./TemplateName.module.css'`, `'./${cssPath}'`);
      } else {
        template = template.replace(`{styles.TemplateName}`, `"${componentName}"`);
        template = template.replace(`styles from './TemplateName.module.css'`, `'./${cssPath}'`);
      }
    } else {
      // --- If no stylesheet, remove className attribute and style import from jsTemplate

      template = template.replace(` className={styles.TemplateName}`, '');
      template = template.replace(`import styles from './TemplateName.module.css';`, '');
    }
  }

  return {
    template,
    templateType: `Component "${componentName}.${fileExtension}"`,
    componentPath: `${componentPathDir}/index.${fileExtension}`,
    componentName,
  };
}

function getReducerScriptTemplate({ cmd, cliConfigFile, componentName, componentPathDir }) {
  const { usesTypeScript } = cliConfigFile;
  const { customTemplates } = cliConfigFile.reducer[cmd.type];
  let fileExtension = usesTypeScript ? 'tsx' : 'js';
  let template = null;

  // Check for a custom component template.

  if (customTemplates && customTemplates.reducer) {
    // --- Load and use the custom component template

    const { template: loadedTemplate, templateFileExtension } = loadCustomTemplate(customTemplates.reducer);

    template = loadedTemplate;
    fileExtension = templateFileExtension;
  } else {
    // --- Else use GRC built-in component template

    template = usesTypeScript ? reducerTsTemplate : componentJsTemplate;

    template = template.replace(` className={styles.TemplateName}`, '');
    template = template.replace(`import styles from './TemplateName.module.css';`, '');
  }

  return {
    template,
    templateType: `Reducer "${componentName}/reducer.${fileExtension}"`,
    componentPath: `${componentPathDir}/reducer.${fileExtension}`,
    componentName,
  };
}

function getActionScriptTemplate({ cmd, cliConfigFile, componentName, componentPathDir }) {
  const { usesTypeScript } = cliConfigFile;
  const { customTemplates } = cliConfigFile.action[cmd.type];
  let fileExtension = usesTypeScript ? 'tsx' : 'js';
  let template = null;

  // Check for a custom action template.

  if (customTemplates && customTemplates.action) {
    // --- Load and use the custom action template

    const { template: loadedTemplate, templateFileExtension } = loadCustomTemplate(customTemplates.action);

    template = loadedTemplate;
    fileExtension = templateFileExtension;
  } else {
    // --- Else use GRC built-in component template

    template = usesTypeScript ? actionTsTemplate : componentJsTemplate;

    template = template.replace(` className={styles.TemplateName}`, '');
    template = template.replace(`import styles from './TemplateName.module.css';`, '');
  }

  return {
    template,
    templateType: `Action "${componentName}/action.${fileExtension}"`,
    componentPath: `${componentPathDir}/action.${fileExtension}`,
    componentName,
  };
}

function getComponentStyleTemplate({ cliConfigFile, cmd, componentName, componentPathDir }) {
  const { customTemplates } = cliConfigFile.component[cmd.type];
  const { cssPreprocessor, usesCssModule } = cliConfigFile;
  const module = usesCssModule ? '.module' : '';
  const cssPath = `${componentName}${module}.${cssPreprocessor}`;
  let template = null;

  // Check for a custom style template.

  if (customTemplates && customTemplates.style) {
    // --- Load and use the custom style template

    const { template: loadedTemplate } = loadCustomTemplate(customTemplates.style);

    template = loadedTemplate;
  } else {
    // --- Else use GRC built-in style template

    template = componentCssTemplate;
  }

  return {
    template,
    templateType: `Stylesheet "${cssPath}"`,
    componentPath: `${componentPathDir}/${cssPath}`,
    componentName,
  };
}

function getComponentTestTemplate({ cliConfigFile, cmd, componentName, componentPathDir }) {
  const { customTemplates } = cliConfigFile.component[cmd.type];
  const { testLibrary, usesTypeScript } = cliConfigFile;
  let fileExtension = usesTypeScript ? 'tsx' : 'js';
  let template = null;

  // Check for a custom test template.

  if (customTemplates && customTemplates.test) {
    // --- Load and use the custom test template

    const { template: loadedTemplate, templateFileExtension } = loadCustomTemplate(customTemplates.test);

    template = loadedTemplate;
    fileExtension = templateFileExtension;
  } else if (testLibrary === 'Enzyme') {
    // --- Else use GRC built-in test template based on test library type

    template = componentTestEnzymeTemplate;
  } else if (testLibrary === 'Testing Library') {
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

function getComponentStoryTemplate({ cliConfigFile, cmd, componentName, componentPathDir }) {
  const { usesTypeScript } = cliConfigFile;
  const { customTemplates } = cliConfigFile.component[cmd.type];
  let fileExtension = usesTypeScript ? 'tsx' : 'js';
  let template = null;

  // Check for a custom story template.

  if (customTemplates && customTemplates.story) {
    // --- Load and use the custom story template

    const { template: loadedTemplate, templateFileExtension } = loadCustomTemplate(customTemplates.story);

    template = loadedTemplate;
    fileExtension = templateFileExtension;
  } else {
    // --- Else use GRC built-in story template

    template = componentStoryTemplate;
  }

  return {
    template,
    templateType: `Story "${componentName}.stories.${fileExtension}"`,
    componentPath: `${componentPathDir}/${componentName}.stories.${fileExtension}`,
    componentName,
  };
}

function getComponentLazyTemplate({ cliConfigFile, cmd, componentName, componentPathDir }) {
  const { usesTypeScript } = cliConfigFile;
  const { customTemplates } = cliConfigFile.component[cmd.type];
  let fileExtension = usesTypeScript ? 'tsx' : 'js';
  let template = null;

  // Check for a custom lazy template.

  if (customTemplates && customTemplates.lazy) {
    // --- Load and use the custom lazy template

    const { template: loadedTemplate, templateFileExtension } = loadCustomTemplate(customTemplates.lazy);

    template = loadedTemplate;
    fileExtension = templateFileExtension;
  } else {
    // --- Else use GRC built-in lazy template

    template = usesTypeScript ? componentTsLazyTemplate : componentLazyTemplate;
  }

  return {
    template,
    templateType: `Lazy "${componentName}.lazy.${fileExtension}"`,
    componentPath: `${componentPathDir}/${componentName}.lazy.${fileExtension}`,
    componentName,
  };
}

// public

// --- Template Types

const componentTemplateTypes = {
  STYLE: 'withStyle',
  TEST: 'withTest',
  STORY: 'withStory',
  LAZY: 'withLazy',
  COMPONENT: 'component',
  REDUCER: 'reducer',
  ACTION: 'action',
};

// --- Template Map

const templateMap = {
  [componentTemplateTypes.STYLE]: getComponentStyleTemplate,
  [componentTemplateTypes.TEST]: getComponentTestTemplate,
  [componentTemplateTypes.STORY]: getComponentStoryTemplate,
  [componentTemplateTypes.LAZY]: getComponentLazyTemplate,
  [componentTemplateTypes.COMPONENT]: getComponentScriptTemplate,
  [componentTemplateTypes.REDUCER]: getReducerScriptTemplate,
  [componentTemplateTypes.ACTION]: getActionScriptTemplate,
};

function generateComponentTemplates(componentTemplates) {
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

function getComponentTemplate(cmd, cliConfigFile, componentName, templateType) {
  const componentPathDir = `${cmd.path}/${componentName}`;

  if (templateMap[templateType]) {
    return templateMap[templateType]({ cmd, cliConfigFile, componentName, componentPathDir });
  }

  return null;
}

module.exports = {
  componentTemplateTypes,
  generateComponentTemplates,
  getComponentTemplate,
};
