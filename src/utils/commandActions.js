import chalk from 'chalk';
import { accessSync, constants, existsSync, outputFileSync, readFileSync } from 'fs-extra';
import replace from 'replace';
import componentJsTemplate from '../../templates/components/componentJsTemplate';
import componentCssTemplate from '../../templates/components/componentCssTemplate';
import componentTestTemplate from '../../templates/components/componentTestTemplate';

// public

export function generateComponent(componentName, cmd) {
  const componentPathDir = `${cmd.path}/${componentName}`;

  // Make sure component name is valid.
  if (!componentName.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
    console.error(
      chalk.red.bold(
        'ERROR: Component name is invalid. Please use a valid naming convention for the component you are trying to create.'
      )
    );

    return;
  }

  // coming soon
  // const grcFile = getGenerateReactConfigFile();

  generateTemplate(
    componentJsTemplate,
    `Component "${componentName}.js"`,
    `${componentPathDir}/${componentName}.js`,
    componentName
  );

  generateTemplate(
    componentCssTemplate,
    `Stylesheet "${componentName}.module.css"`,
    `${componentPathDir}/${componentName}.module.css`,
    componentName
  );

  generateTemplate(
    componentTestTemplate,
    `Test "${componentName}.test.js"`,
    `${componentPathDir}/${componentName}.test.js`,
    componentName
  );
}

// private

function generateTemplate(template, templateType, componentPath, componentName) {
  // Make sure the component templateType does not already exist in the path directory.
  if (existsSync(componentPath)) {
    console.log(chalk.red(`${templateType} already exists in this path "${componentPath}".`));
  } else {
    try {
      outputFileSync(componentPath, template);

      replace({
        regex: 'TemplateName',
        replacement: componentName,
        paths: [componentPath],
        recursive: false,
        silent: true,
      });

      console.log(chalk.cyan(`${templateType} was created successfully at ${componentPath}`));
    } catch (error) {
      console.log(chalk.red(`${templateType} failed and was not created.`));
      console.log(error);
    }
  }
}


// coming soon ...
function getGenerateReactConfigFile() {
  try {
    accessSync('./package.json', constants.R_OK);

    try {
      accessSync('./generateReactConfig.json', constants.R_OK);
      return JSON.parse(readFileSync('./generateReactConfig.json'));
    } catch (error) {
      console.error(chalk.red.bold('no config file'));
      process.exit(1);
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
