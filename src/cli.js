import program from 'commander';
import chalk from 'chalk';
import { existsSync, outputFileSync } from 'fs-extra';
import replace from 'replace';
import componentJsTemplate from '../templates/components/componentJsTemplate';
import componentCssTemplate from '../templates/components/componentCssTemplate';
import componentTestTemplate from '../templates/components/componentTestTemplate';

let commandNotFound = true;

export function cli(args) {
  program.version('1.0.0');

  // Generate Component
  program
    .command('component <name>')
    .option('-p, --path <path>', 'With specified path value')
    .action(generateComponent);

  program.parse(args);

  if (commandNotFound) {
    console.log(chalk.red('Command not found.'));
    console.log(`Run ${chalk.green('generate-react --help')} to see a list of the commmands you can run.`);
  }
}

function generateComponent(componentName, cmd) {
  const componentPathDir = cmd.path ? `${cmd.path}/${componentName}` : `./src/components/${componentName}`;

  commandNotFound = false;

  // Make sure component name is valid.
  if (!componentName.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
    console.error(
      chalk.red.bold(
        'ERROR: Component name is invalid. Please use a valid naming convention for the component you are trying to create.'
      )
    );

    return;
  }

  // Make sure the stylesheet file does not already exists in the path directory.
  if (existsSync(`${componentPathDir}/${componentName}.module.css`)) {
    console.log(
      chalk.red(`Stylesheet "${componentName}.module.css" already exists in this path "${componentPathDir}".`)
    );
  } else {
    try {
      outputFileSync(`${componentPathDir}/${componentName}.module.css`, componentCssTemplate);

      replace({
        regex: 'TemplateName',
        replacement: componentName,
        paths: [`${componentPathDir}/${componentName}.module.css`],
        recursive: false,
        silent: true,
      });

      console.log(
        chalk.cyan(
          `Stylesheet ${componentName} was created successfully at ${componentPathDir}/${componentName}.module.css`
        )
      );
    } catch (error) {
      console.log(chalk.red(`Stylesheet ${componentName} was not created successfully.`));
      console.log(error);
    }
  }

  // Make sure the component JS file does not already exists in the path directory.
  if (existsSync(`${componentPathDir}/${componentName}.js`)) {
    console.log(chalk.red(`Component "${componentName}.js" already exists in this path "${componentPathDir}".`));
  } else {
    try {
      outputFileSync(`${componentPathDir}/${componentName}.js`, componentJsTemplate);

      replace({
        regex: 'TemplateName',
        replacement: componentName,
        paths: [`${componentPathDir}/${componentName}.js`],
        recursive: false,
        silent: true,
      });

      console.log(
        chalk.cyan(`Component ${componentName} was created successfully at ${componentPathDir}/${componentName}.js`)
      );
    } catch (error) {
      console.log(chalk.red(`Component ${componentName} was not created successfully.`));
      console.log(error);
    }
  }

  // Make sure the Test file does not already exists in the path directory.
  if (existsSync(`${componentPathDir}/${componentName}.test.js`)) {
    console.log(chalk.red(`Test "${componentName}.test.js" already exists in this path "${componentPathDir}".`));
  } else {
    try {
      outputFileSync(`${componentPathDir}/${componentName}.test.js`, componentTestTemplate);

      replace({
        regex: 'TemplateName',
        replacement: componentName,
        paths: [`${componentPathDir}/${componentName}.test.js`],
        recursive: false,
        silent: true,
      });

      console.log(
        chalk.cyan(`Test ${componentName} was created successfully at ${componentPathDir}/${componentName}.test.js`)
      );
    } catch (error) {
      console.log(chalk.red(`Test ${componentName} was not created successfully.`));
      console.log(error);
    }
  }
}
