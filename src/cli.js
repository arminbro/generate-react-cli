import program from 'commander';
import chalk from 'chalk';
import pkg from '../package.json';
import { generateComponent, getCLIConfigFile } from './services/commandActions';

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
    .action((componentName, cmd) => generateComponent(componentName, cmd, component))
    .action(() => (commandNotFound = false));

  program.parse(args);

  if (commandNotFound) {
    console.error(chalk.red('Command not found.'));
    console.log(`Run ${chalk.green('generate-react --help')} to see a list of the commmands you can run.`);
    process.exit(1);
  }
}
