import program from 'commander';
import chalk from 'chalk';
import pkg from '../package.json';
import { generateComponent } from './actions/componentActions';
import { getCLIConfigFile } from './services/configService';

let commandNotFound = true;

export async function cli(args) {
  const cliConfigFile = (await getCLIConfigFile()) || {};
  const { component } = cliConfigFile;

  program.version(pkg.version);

  // Generate Component
  program
    .command('component <name>')
    .alias('c')
    .option('-p, --path <path>', 'With specified path value', component.path || './src/components')
    .option(
      '-t, --withTest <withTest>',
      'Would you like to create a corresponding test file with this component?',
      component.withTest
    )
    .option(
      '-s, --withStory <withStory>',
      'Would you like to create a corresponding story file with this component?',
      component.withStory
    )
    .option(
      '-l, --withLazy <withLazy>',
      'Would you like to create a corresponding lazy file (a file that lazy-loads your component out of the box and enables code splitting: https://reactjs.org/docs/code-splitting.html#code-splitting) with this component?',
      component.withLazy
    )
    .action((componentName, cmd) => generateComponent(componentName, cmd, component))
    .action(() => (commandNotFound = false));

  program.parse(args);

  if (commandNotFound) {
    console.error(chalk.red('Command not found.'));
    console.log(`Run ${chalk.green('generate-react --help')} to see a list of the commmands you can run.`);
    process.exit(1);
  }
}
