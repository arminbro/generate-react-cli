import chalk from 'chalk';
import { accessSync, constants, readFileSync } from 'fs-extra';
import deepKeys from 'deep-keys';
import { generateComponentTemplates } from '../utils/templateUtils';
import { createCLIConfig, updateCLIConfig } from './cliConfig';
import grcConfigTemplateFIle from '../../templates/configs/grc-configi-template.json'
import componentJsTemplate from '../../templates/components/componentJsTemplate';
import componentCssTemplate from '../../templates/components/componentCssTemplate';
import componentTestTemplate from '../../templates/components/componentTestTemplate';
import componentStoryTemplate from '../../templates/components/componentStoryTemplate';

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

  if (componentConfig.withTest) {
    componentTemplates.push({
      template: componentTestTemplate,
      templateType: `Test "${componentName}.test.js"`,
      componentPath: `${componentPathDir}/${componentName}.test.js`,
      componentName,
    });
  }

  if (componentConfig.withStory) {
    componentTemplates.push({
      template: componentStoryTemplate,
      templateType: `Story "${componentName}.stories.js"`,
      componentPath: `${componentPathDir}/${componentName}.stories.js`,
      componentName,
    });
  }

  generateComponentTemplates(componentTemplates);
}

export async function getCLIConfigFile() {
  // Make sure the cli commands are running from the root level of the project
  try {
    accessSync('./package.json', constants.R_OK);

    // check to see if the grc config file exists
    try {
      accessSync('./generate-react-cli.json', constants.R_OK);
      const configFile = JSON.parse(readFileSync('./generate-react-cli.json'));

      if (deepKeys(configFile).toString() !== deepKeys(grcConfigTemplateFIle).toString()) {
        return await updateCLIConfig();
      }
  
      return configFile;
    } catch (e) {
      return await createCLIConfig();
    }
  } catch (error) {
    console.error(
      chalk.red.bold(
        "ERROR: Please make sure that you're running the generate-react-cli commands from the root level of your React project"
      )
    );
    process.exit(1);
  }
}
