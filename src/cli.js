import program from 'commander';
// import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';

const access = promisify(fs.access);
const copy = promisify(ncp);
let commandNotFound = true;

export function cli(args) {
  program.version('1.0.0');

  // Generate Component
  program.command('component').action(generateComponent);

  program.parse(args);

  if (commandNotFound) {
    console.log(chalk.red('Command not found.'));
    console.log(`Run ${chalk.green('generate-react --help')} to see a list of the commmands you can run.`);
  }
}

async function generateComponent(componentPath, cmd) {
  commandNotFound = false;

  const componentTemplateDir = path.resolve(new URL(import.meta.url).pathname, '../../templates/components');

  // Make sure we have access to the template directory.
  try {
    await access(componentTemplateDir, fs.constants.R_OK);
  } catch (error) {
    console.error(chalk.red.bold('ERROR: ', error));
    process.exit(1);
  }

  // Copy template over to target destination
  try {
    await copy(componentTemplateDir, `./src/components/${componentPath}`, { clobber: false });
  } catch (error) {
    console.log(chalk.red('ERROR: ', error));
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
