import program from 'commander';
import chalk from 'chalk';
import pkg from '../package.json';
import { generateComponent } from './utils/commandActions';

let commandNotFound = true;

export function cli(args) {
  program.version(pkg.version);

  // Generate Component
  program
    .command('component <name>')
    .alias('c')
    .option('-p, --path <path>', 'With specified path value', './src/components')
    .action(generateComponent)
    .action(() => (commandNotFound = false));

  program.parse(args);

  if (commandNotFound) {
    console.log(chalk.red('Command not found.'));
    console.log(`Run ${chalk.green('generate-react --help')} to see a list of the commmands you can run.`);
    process.exit(1);
  }
}
