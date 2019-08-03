import program from 'commander';
import chalk from 'chalk';
import { accessSync, constants, copySync, existsSync } from 'fs-extra';
import path from 'path';

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
  const componentTemplateDir = path.resolve(new URL(import.meta.url).pathname, '../../templates/components');
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

  // Make sure we have access to the template directory.
  try {
    accessSync(componentTemplateDir, constants.R_OK);
  } catch (error) {
    console.error(chalk.red.bold('ERROR: ', error));
    return process.exit(1);
  }

  // Make sure the component does not already exists in the path.
  if (existsSync(componentPathDir)) {
    console.log(chalk.red(`Component "${componentName}" already exists in this path "${componentPathDir}".`));
  } else {
    // Copy template over to target destination
    try {
      copySync(componentTemplateDir, componentPathDir, { clobber: false });
    } catch (error) {
      console.log(chalk.red('ERROR: ', error));
    }
  }
}

// still in progress - coming soon..
// async function promptQuestionsForGenerateReactProject() {
//   const questions = [
//     {
//       type: 'list',
//       name: 'router',
//       message: 'Does this project require a routing system?',
//       choices: ['React Router', 'No router'],
//       default: 'No router',
//     },
//   ];

//   const answers = await inquirer.prompt(questions);

//   return answers;
// }
