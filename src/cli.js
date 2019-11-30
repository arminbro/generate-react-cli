import program from 'commander';
import chalk from 'chalk';
import pkg from '../package.json';
import { generateComponent } from './actions/componentActions';
import { getCLIConfigFile } from './services/configService';

let commandNotFound = true;

export async function cli(args) {
  const cliConfigFile = await getCLIConfigFile();
  const { component } = cliConfigFile;

  program.version(pkg.version);

  // Generate Component
  program
    .command('component <name>')
    .alias('c')

    .option('-p, --path <path>', 'Path of where the component will get genereted in.', component.path)

    .option('--withStyle', 'With corresponding test file.', component.css.withStyle)
    .option('--no-withStyle', 'Without corresponding test file.')

    .option('--withTest', 'With corresponding test file.', component.test.withTest)
    .option('--no-withTest', 'Without corresponding test file.')

    .option('--withStory', 'With corresponding story file.', component.withStory)
    .option('--no-withStory', 'Without corresponding story file.')

    .option('--withLazy', 'With corresponding lazy file.', component.withLazy)
    .option('--no-withLazy', 'Without corresponding lazy file.')

    .action((componentName, cmd) => generateComponent(componentName, cmd, component))
    .action(() => (commandNotFound = false));

  program.parse(args);

  if (commandNotFound) {
    console.error(chalk.red('Command not found.'));
    console.log(`Run ${chalk.green('generate-react --help')} to see a list of the commmands you can run.`);
    process.exit(1);
  }
}
